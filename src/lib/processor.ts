
import JSZip from 'jszip'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'
import Papa from 'papaparse'
import { processExtendedTool } from './extendedProcessor'

export type ProcessResult = { kind: 'text'; value: string } | { kind: 'blob'; blob: Blob; filename: string; preview?: 'image' | 'pdf' } | { kind: 'html'; value: string }

const blobResult = (blob: Blob, filename: string, preview?: 'image'|'pdf'): ProcessResult => ({kind:'blob',blob,filename,preview})
const textResult = (value: string): ProcessResult => ({kind:'text',value})
const MAX_INPUT_FILE_BYTES = 80 * 1024 * 1024
const MAX_ARCHIVE_OUTPUT_BYTES = 120 * 1024 * 1024
const MAX_PDF_TOTAL_RENDER_PIXELS = 50_000_000
const MAX_ARCHIVE_ENTRIES = 250
const MAX_IMAGE_PIXELS = 32_000_000
const MAX_PDF_PAGES = 250
const MAX_PDF_RENDER_PIXELS = 24_000_000
const safeName = (name: string) => {
  const clean = name.replace(/[\\/\0-\x1f<>:\"|?*]+/g, '_').replace(/^\.+/, '').trim()
  return clean && clean !== '.' ? clean.slice(0, 180) : 'file'
}
const safeZipPath = (name: string) => {
  const raw = name.replace(/\\/g, '/').replace(/^\/+/, '')
  const parts = raw.split('/').filter(Boolean)
  if (!parts.length || parts.some(part => part === '.' || part === '..' || /^[a-zA-Z]:/.test(part) || ['__proto__','constructor','prototype'].includes(part.toLowerCase()))) {
    throw new Error('The archive contains an unsafe file path.')
  }
  return parts.map(safeName).join('/')
}
const assertFileSize = (file: File, max = MAX_INPUT_FILE_BYTES) => {
  if (file.size > max) throw new Error(`${file.name} is larger than the ${Math.round(max / 1024 / 1024)} MB browser-processing limit.`)
}
const assertFilesSize = (files: File[], max = MAX_INPUT_FILE_BYTES) => {
  const total = files.reduce((sum, item) => sum + item.size, 0)
  if (total > max) throw new Error(`Selected files exceed the ${Math.round(max / 1024 / 1024)} MB processing limit.`)
}
const readText = (f: File) => f.text()
const compareTextLines=(first:string[],second:string[])=>{const changes:string[]=[];const count=Math.max(first.length,second.length);for(let i=0;i<count&&changes.length<300;i++){const a=first[i],b=second[i];if(a!==b){const clip=(value:string|undefined)=>value===undefined?'[missing]':value.length>1000?value.slice(0,1000)+'… [line truncated]':value;changes.push(`Line ${i+1}:\n  First: ${clip(a)}\n  Second: ${clip(b)}`)}}return changes.length?changes.join('\n\n')+(count>300?'\n\nOnly the first 300 differing lines are shown.':''):'No line differences.'}
const utf8Base64 = (value:string) => bytesToBase64(new TextEncoder().encode(value))
const base64ToBytes = (value:string) => {
  if (value.length > 14_000_000) throw new Error('Base64 input is too large to decode safely.')
  const clean=value.trim().replace(/\s/g,'')
  if(clean.length%4===1||!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)||(clean.includes('=')&&clean.length%4!==0))throw new Error('Base64 text is invalid.')
  const raw=atob(clean+'='.repeat((4-clean.length%4)%4))
  return Uint8Array.from(raw,char=>char.charCodeAt(0))
}
const base64Utf8 = (value:string) => new TextDecoder('utf-8', { fatal: true }).decode(base64ToBytes(value))
const runRegexInWorker = (pattern:string, value:string, flags:string) => new Promise<string>((resolve,reject) => {
  if (typeof Worker === 'undefined') { reject(new Error('This browser does not support isolated regular-expression processing.')); return }
  const source = `self.onmessage = ({data}) => { try { const re = new RegExp(data.pattern, data.flags); const matches = []; let m; while ((m = re.exec(data.value)) !== null) { matches.push(m[0] + ' (index ' + m.index + ')'); if (!re.global) break; if (m[0] === '') re.lastIndex++; if (matches.length >= 10000) break; } self.postMessage({ok:true, value:matches.length ? matches.join('\\n') : 'No matches found.'}); } catch (error) { self.postMessage({ok:false, error:error instanceof Error ? error.message : 'Invalid regular expression.'}); } };`
  const url = URL.createObjectURL(new Blob([source], {type:'text/javascript'}))
  const worker = new Worker(url)
  const finish = (fn:(value:any)=>void, value:any) => { window.clearTimeout(timer); worker.terminate(); URL.revokeObjectURL(url); fn(value) }
  const timer = window.setTimeout(() => finish(reject, new Error('Regular expression timed out. Simplify the pattern or use a shorter input.')), 750)
  worker.onmessage = event => event.data?.ok ? finish(resolve, event.data.value) : finish(reject, new Error(event.data?.error || 'Regular expression failed.'))
  worker.onerror = () => finish(reject, new Error('Regular expression worker failed.'))
  worker.postMessage({pattern, value, flags})
})
const parseDateOnly = (value:string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return NaN
  const year=Number(match[1]), month=Number(match[2]), day=Number(match[3])
  if(year<1||month<1||month>12||day<1||day>31)return NaN
  const date=new Date(0);date.setUTCHours(0,0,0,0);date.setUTCFullYear(year,month-1,day)
  return date.getUTCFullYear()===year && date.getUTCMonth()===month-1 && date.getUTCDate()===day ? date.getTime() : NaN
}
const fileRequired = (files: File[], count = 1) => {
  if (files.length < count) throw new Error(`Choose ${count === 1 ? 'a file' : `${count} files`} first.`)
}
const downloadZip = async (items: {name:string; data: Blob|Uint8Array|string}[]) => {
  if (items.length > MAX_ARCHIVE_ENTRIES) throw new Error(`A ZIP can contain at most ${MAX_ARCHIVE_ENTRIES} files in this app.`)
  const estimated = items.reduce((sum, item) => sum + (typeof item.data === 'string' ? new TextEncoder().encode(item.data).byteLength : item.data instanceof Blob ? item.data.size : item.data.byteLength), 0)
  if (estimated > MAX_ARCHIVE_OUTPUT_BYTES) throw new Error('The generated ZIP would exceed the safe in-browser processing limit.')
  const zip = new JSZip()
  const used = new Set<string>()
  items.forEach(x => { const name=safeZipPath(x.name); if (used.has(name)) throw new Error(`Duplicate archive filename: ${name}`); used.add(name); zip.file(name, x.data) })
  const blob = await zip.generateAsync({type:'blob', compression:'DEFLATE', compressionOptions:{level:5}})
  if (blob.size > MAX_ARCHIVE_OUTPUT_BYTES) throw new Error('The generated ZIP is too large for safe in-browser processing.')
  return blob
}
const getImage = async (file: File) => {
  assertFileSize(file)
  const bitmap = await createImageBitmap(file)
  if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) {
    bitmap.close()
    throw new Error(`Images must be no larger than ${MAX_IMAGE_PIXELS.toLocaleString()} pixels.`)
  }
  return bitmap
}
const canvasBlob = (canvas: HTMLCanvasElement, type='image/png', quality=0.9) =>
  new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not create image output.')),type,quality))
const makeCanvas = (w:number,h:number) => {
  const c=document.createElement('canvas'); c.width=w; c.height=h; return c
}
const randomIntInclusive = (min:number, max:number) => {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || max < min) throw new Error('Enter a valid whole-number range.')
  const range = max - min + 1
  if (range <= 0 || range > 0x1_0000_0000) throw new Error('The requested number range is too large.')
  const limit = Math.floor(0x1_0000_0000 / range) * range
  const values = new Uint32Array(1)
  let value = 0
  do { crypto.getRandomValues(values); value = values[0] } while (value >= limit)
  return min + (value % range)
}
const randomCharacters = (chars:string, length:number) => {
  if (!chars.length) throw new Error('Character set cannot be empty.')
  if (chars.length > 255) throw new Error('Use at most 255 distinct characters for random-string generation.')
  const out:string[] = []
  const limit = Math.floor(256 / chars.length) * chars.length
  while (out.length < length) {
    const bytes = crypto.getRandomValues(new Uint8Array(Math.max(16, (length - out.length) * 2)))
    for (const byte of bytes) {
      if (byte < limit) out.push(chars[byte % chars.length])
      if (out.length === length) break
    }
  }
  return out.join('')
}
const bytesToBase64 = (bytes:Uint8Array) => {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}
const dataUrlToBlob = (url:string) => {
  const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([a-z0-9+/=]+)$/i.exec(url)
  if (!match || match[2].length > 20_000_000) throw new Error('Enter a valid PNG, JPEG, WebP or GIF Base64 data URL (maximum 15 MB).')
  const binary = atob(match[2])
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new Blob([bytes], {type:match[1].toLowerCase()})
}
const pdfBlob = async (pdf: PDFDocument) => new Blob([new Uint8Array(await pdf.save()).buffer as ArrayBuffer], { type: 'application/pdf' })
const bytesToHex = (bytes: Uint8Array) => [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('')
const digest = async (data: BufferSource, algorithm='SHA-256') => bytesToHex(new Uint8Array(await crypto.subtle.digest(algorithm,data)))
const downloadDataUrlBlob = async (url:string) => dataUrlToBlob(url)

// Safe arithmetic parser: supports numbers, parentheses, + - * / % and exponentiation.
function calculate(expression:string): number {
  if(expression.length>2000)throw new Error('Calculator expression is limited to 2,000 characters.');
  const tokens=expression.match(/\d*\.?\d+(?:e[+-]?\d+)?|[()+\-*/%^]/gi)
  if(!tokens || tokens.length>500 || tokens.join('')!==expression.replace(/\s/g,'')) throw new Error('Use only numbers, parentheses and + - * / % ^ operators.')
  let i=0
  const peek=()=>tokens[i]
  const take=()=>tokens[i++]
  const primary=():number=>{
    const t=take()
    if(t==='+') return primary()
    if(t==='-') return -primary()
    if(t==='('){const v=add();if(take()!==')')throw new Error('Missing closing parenthesis.');return v}
    const n=Number(t);if(!Number.isFinite(n))throw new Error('Invalid number.');return n
  }
  const power=():number=>{let a=primary();if(peek()==='^'){take();a=Math.pow(a,power())}return a}
  const mul=():number=>{let a=power();while(['*','/','%'].includes(peek())){const op=take();const b=power();a=op==='*'?a*b:op==='/'?a/b:a%b}return a}
  const add=():number=>{let a=mul();while(['+','-'].includes(peek())){const op=take();const b=mul();a=op==='+'?a+b:a-b}return a}
  const value=add();if(i!==tokens.length)throw new Error('Invalid expression.');if(!Number.isFinite(value))throw new Error('Result is not finite.');return value
}
const morse:Record<string,string>={a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','0':'-----'}
const reverseMorse=Object.fromEntries(Object.entries(morse).map(([k,v])=>[v,k]))
const mdToHtml=(md:string)=>md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>')
  .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>')
  .replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\n/g,'<br>')

export async function processTool(id:string, files:File[], input:string, secondary:string, opts:Record<string,string|number|boolean>={}):Promise<ProcessResult>{
  if(input.length>10_000_000||secondary.length>10_000_000)throw new Error('Text input is limited to 10 MB per field.');
  const file=files[0]
  switch(id){
    // FILE MANAGEMENT
    case 'zip-creator':{
      fileRequired(files);if(files.length>MAX_ARCHIVE_ENTRIES)throw new Error(`A ZIP can contain at most ${MAX_ARCHIVE_ENTRIES} files.`);assertFilesSize(files, MAX_INPUT_FILE_BYTES);const used=new Set<string>();const items=files.map((f,i)=>{let name=safeZipPath(f.name);if(used.has(name)){const dot=name.lastIndexOf('.');const stem=dot>0?name.slice(0,dot):name;const ext=dot>0?name.slice(dot):'';let suffix=2;let candidate='';do{candidate=`${stem}-${suffix++}${ext}`}while(used.has(candidate));name=candidate}used.add(name);return{name,data:f}})
      return blobResult(await downloadZip(items),'ap-tools-archive.zip')
    }
    case 'zip-extractor':{
      fileRequired(files);assertFileSize(file, 60 * 1024 * 1024);const zip=await JSZip.loadAsync(file,{checkCRC32:false});const out:{name:string;data:Blob}[]=[]
      const entries=Object.entries(zip.files).filter(([,entry])=>!entry.dir)
      if(entries.length>MAX_ARCHIVE_ENTRIES)throw new Error(`ZIP contains more than ${MAX_ARCHIVE_ENTRIES} files.`)
      let total=0
      for(const [name,entry] of entries){
        const declared=Number((entry as any)._data?.uncompressedSize||0)
        if(declared>80*1024*1024 || total+declared>MAX_ARCHIVE_OUTPUT_BYTES)throw new Error('ZIP expands beyond the safe extraction limit.')
        const blob=await entry.async('blob');total+=blob.size
        if(blob.size>80*1024*1024 || total>MAX_ARCHIVE_OUTPUT_BYTES)throw new Error('ZIP expands beyond the safe extraction limit.')
        out.push({name:safeZipPath(name),data:blob})
      }
      return blobResult(await downloadZip(out),'extracted-files.zip')
    }
    case 'file-type':{
      fileRequired(files);const b=new Uint8Array(await file.slice(0,16).arrayBuffer())
      const signatures=[{s:[0x25,0x50,0x44,0x46],n:'PDF'},{s:[0x89,0x50,0x4e,0x47],n:'PNG'},{s:[0xff,0xd8,0xff],n:'JPEG'},{s:[0x50,0x4b,0x03,0x04],n:'ZIP'},{s:[0x47,0x49,0x46,0x38],n:'GIF'}]
      const found=signatures.find(x=>x.s.every((v,i)=>b[i]===v))?.n||'Unknown / text-based'
      return textResult(`Name: ${file.name}\nDetected signature: ${found}\nMIME type: ${file.type||'Not provided'}\nSize: ${file.size.toLocaleString()} bytes`)
    }
    case 'file-size':{fileRequired(files);return textResult(`${file.name}\nBytes: ${file.size}\nKB: ${(file.size/1024).toFixed(2)}\nMB: ${(file.size/1048576).toFixed(3)}\nGB: ${(file.size/1073741824).toFixed(5)}`)}
    case 'file-hash':{fileRequired(files);assertFileSize(file);return textResult(`SHA-256\n${await digest(await file.arrayBuffer())}`)}
    case 'file-compare':{
      if(files.length!==2)throw new Error('Choose exactly two text files.');assertFilesSize(files, 20 * 1024 * 1024);const [a,b]=await Promise.all(files.slice(0,2).map(readText))
      const aLines=a.split(/\r?\n/),bLines=b.split(/\r?\n/);return textResult(a===b?'The two files are identical.':`Files differ.\nFirst file: ${a.length} characters\nSecond file: ${b.length} characters\nLine-by-line differences:\n${compareTextLines(aLines,bLines)}`)
    }
    case 'bulk-rename':{
      fileRequired(files);if(files.length>MAX_ARCHIVE_ENTRIES)throw new Error(`Choose no more than ${MAX_ARCHIVE_ENTRIES} files.`);assertFilesSize(files, MAX_INPUT_FILE_BYTES);const prefix=safeName(String(opts.prefix||'file'));const start=Number(opts.start||1)
      if(!Number.isSafeInteger(start)||start<0)throw new Error('Starting number must be a non-negative whole number.')
      const items=files.map((f,i)=>({name:`${prefix}-${start+i}.${safeName(f.name.split('.').pop()||'bin')}`,data:f}))
      return blobResult(await downloadZip(items),'renamed-files.zip')
    }
    case 'text-file':return blobResult(new Blob([input],{type:'text/plain'}),'created.txt')
    case 'json-file':{const parsed=JSON.parse(input||'{}');return blobResult(new Blob([JSON.stringify(parsed,null,2)],{type:'application/json'}),'created.json')}
    case 'csv-file':return blobResult(new Blob([input],{type:'text/csv'}),'created.csv')

    // PDF
    case 'pdf-compress':case 'pdf-repair':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      let pdf:PDFDocument
      try{pdf=await PDFDocument.load(await file.arrayBuffer(),{ignoreEncryption:false,updateMetadata:false})}
      catch(error){throw new Error(id==='pdf-repair'?'This PDF could not be opened by the repair engine. It may be encrypted, severely damaged or use unsupported features.':'This PDF could not be opened for compression. Check that it is a valid, unencrypted PDF.')}
      if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      const bytes=await pdf.save({useObjectStreams:true,addDefaultPage:false,objectsPerTick:50})
      const filename=id==='pdf-compress'?'compressed.pdf':'repaired.pdf'
      return blobResult(new Blob([bytes],{type:'application/pdf'}),filename,'pdf')
    }
    case 'pdf-extract-pages':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const src=await PDFDocument.load(await file.arrayBuffer()),count=src.getPageCount()
      if(count>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      if(!input.trim()||!/^[0-9,\s-]+$/.test(input))throw new Error('Enter page numbers or ranges, e.g. 1,3-5.')
      const indexes:number[]=[]
      for(const part of input.split(',')){const bits=part.trim().split('-').map(Number);if(bits.length>2||bits.some(n=>!Number.isInteger(n)||n<1||n>count))throw new Error('Page selection is outside this PDF.');const start=bits[0],end=bits[1]||start;if(end<start||end-start>MAX_PDF_PAGES)throw new Error('Invalid page range.');for(let n=start;n<=end;n++)indexes.push(n-1)}
      if(new Set(indexes).size!==indexes.length||indexes.length>MAX_PDF_PAGES)throw new Error('Do not repeat pages; select at most 250 pages.')
      const out=await PDFDocument.create();(await out.copyPages(src,indexes)).forEach(page=>out.addPage(page))
      return blobResult(await pdfBlob(out),'extracted-pages.pdf','pdf')
    }
    case 'pdf-edit-annotate':case 'pdf-sign-visible':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      if(!input.trim()||input.length>300)throw new Error('Enter text to place on the PDF (maximum 300 characters).')
      const pdf=await PDFDocument.load(await file.arrayBuffer())
      if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      const page=pdf.getPages()[0],font=await pdf.embedFont(StandardFonts.Helvetica)
      const {width,height}=page.getSize()
      const isSign=id==='pdf-sign-visible'
      page.drawText(input,{x:isSign?Math.min(72,width/4):48,y:isSign?Math.max(48,height/5):Math.max(48,height-72),size:isSign?20:12,font,color:rgb(.08,.18,.48),maxWidth:width-96})
      return blobResult(await pdfBlob(pdf),isSign?'signed-visual.pdf':'annotated.pdf','pdf')
    }
    case 'pdf-scan-images':case 'image-pdf':{
      fileRequired(files);if(files.length>50)throw new Error('Choose no more than 50 scanned images.');assertFilesSize(files,80*1024*1024)
      const pdf=await PDFDocument.create();let total=0
      for(const f of files){assertFileSize(f);const sig=new Uint8Array(await f.slice(0,8).arrayBuffer());const png=[137,80,78,71,13,10,26,10].every((v,i)=>sig[i]===v),jpg=sig[0]===255&&sig[1]===216&&sig[2]===255;if(!png&&!jpg)throw new Error(f.name+': only PNG and JPEG scans are supported.');const b=await getImage(f);total+=b.width*b.height;b.close();if(total>MAX_PDF_TOTAL_RENDER_PIXELS)throw new Error('Scanned images exceed the safe combined pixel limit.');const bytes=await f.arrayBuffer(),img=png?await pdf.embedPng(bytes):await pdf.embedJpg(bytes),page=pdf.addPage([img.width,img.height]);page.drawImage(img,{x:0,y:0,width:img.width,height:img.height})}
      return blobResult(await pdfBlob(pdf),'scanned-document.pdf','pdf')
    }
    case 'pdf-merge':{
      fileRequired(files,2);if(files.length>MAX_PDF_PAGES)throw new Error(`Choose no more than ${MAX_PDF_PAGES} PDFs.`);assertFilesSize(files, 80 * 1024 * 1024);const out=await PDFDocument.create()
      for(const f of files){assertFileSize(f);const src=await PDFDocument.load(await f.arrayBuffer());if(src.getPageCount()+out.getPageCount()>MAX_PDF_PAGES)throw new Error(`PDF output is limited to ${MAX_PDF_PAGES} pages.`);(await out.copyPages(src,src.getPageIndices())).forEach(p=>out.addPage(p))}
      return blobResult(await pdfBlob(out),'merged.pdf','pdf')
    }
    case 'pdf-split':{
      fileRequired(files);assertFileSize(file,60*1024*1024);const src=await PDFDocument.load(await file.arrayBuffer());if(src.getPageCount()>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`);if(input.length>2000)throw new Error('Page selection is limited to 250 page numbers.');if(input.trim()&&!/^\d+(\s*,\s*\d+)*$/.test(input.trim()))throw new Error('Enter page numbers as a comma-separated list, e.g. 1,3,5.');const indexes=input.trim()?input.split(',').map(x=>Number(x.trim())-1):src.getPageIndices();if(indexes.length>MAX_PDF_PAGES)throw new Error(`Choose no more than ${MAX_PDF_PAGES} pages at a time.`)
      const out=await PDFDocument.create();for(const n of indexes){if(!Number.isInteger(n)||n<0||n>=src.getPageCount())throw new Error(`Page ${n+1} does not exist.`);const [p]=await out.copyPages(src,[n]);out.addPage(p)}
      return blobResult(await pdfBlob(out),'split-pages.pdf','pdf')
    }
    case 'html-to-pdf':{
      fileRequired(files);assertFileSize(file,15*1024*1024)
      if(!/\.html?$/i.test(file.name)&&file.type!=='text/html')throw new Error('Upload an .html or .htm file.')
      const source=await file.text();if(!source.trim())throw new Error('The HTML file is empty.')
      if(source.length>5_000_000)throw new Error('HTML source is limited to 5 MB.')
      const parsed=new DOMParser().parseFromString(source,'text/html')
      parsed.querySelectorAll('script,iframe,object,embed,form,video,audio,link[rel="stylesheet"]').forEach(node=>node.remove())
      parsed.querySelectorAll('*').forEach(node=>{for(const attr of Array.from(node.attributes)){if(/^on/i.test(attr.name)||((attr.name==='src'||attr.name==='href')&&/^\s*javascript:/i.test(attr.value)))node.removeAttribute(attr.name)}})
      const style=parsed.createElement('style');style.textContent='*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Arial,sans-serif;font-size:14px;line-height:1.45}body{padding:32px;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{border-collapse:collapse;max-width:100%}td,th{border:1px solid #777;padding:5px}pre{white-space:pre-wrap}h1{font-size:26px}h2{font-size:21px}h3{font-size:17px}';parsed.head.append(style)
      const html='<!doctype html>'+parsed.documentElement.outerHTML
      const width=794,height=1123;const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:'+width+'px;min-height:'+height+'px;background:white">'+html.replace(/&/g,'&amp;')+'</div></foreignObject></svg>'
      const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}))
      try{const image=new Image();image.decoding='sync';await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('This browser could not render the HTML file. Try simpler HTML without external resources.'));image.src=url})
        const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d');if(!context)throw new Error('Canvas is unavailable.')
        context.fillStyle='#fff';context.fillRect(0,0,width,height);context.drawImage(image,0,0,width,height)
        const png=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not render HTML.')),'image/png'))
        const pdf=await PDFDocument.create();const embedded=await pdf.embedPng(new Uint8Array(await png.arrayBuffer()));const page=pdf.addPage([595.28,841.89]);page.drawImage(embedded,{x:0,y:0,width:595.28,height:841.89})
        return blobResult(await pdfBlob(pdf),'html-to-pdf.pdf','pdf')
      }finally{URL.revokeObjectURL(url)}
    }
    case 'word-to-pdf':{
      fileRequired(files);assertFileSize(file,40*1024*1024)
      const signature=new Uint8Array(await file.slice(0,4).arrayBuffer())
      if(signature[0]!==0x50||signature[1]!==0x4b)throw new Error('Upload a valid .docx Word document. Legacy .doc files are not supported.')
      const zip=await JSZip.loadAsync(file)
      const documentFile=zip.file('word/document.xml')
      if(!documentFile)throw new Error('This DOCX file does not contain a readable Word document.')
      const xml=await documentFile.async('text')
      const parsed=new DOMParser().parseFromString(xml,'application/xml')
      if(parsed.getElementsByTagName('parsererror').length)throw new Error('The Word document XML is invalid or corrupted.')
      const paragraphs=Array.from(parsed.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','p'))
      if(!paragraphs.length)throw new Error('No readable paragraphs were found in this Word document.')
      const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold)
      const pageWidth=612,pageHeight=792,margin=54,fontSize=10.5,lineHeight=14,maxWidth=pageWidth-margin*2
      let page=pdf.addPage([pageWidth,pageHeight]),y=pageHeight-margin,extracted=0
      const newPage=()=>{page=pdf.addPage([pageWidth,pageHeight]);y=pageHeight-margin}
      const drawLine=(line:string,isBold=false)=>{
        if(y<margin+lineHeight)newPage()
        page.drawText(line,{x:margin,y,size:fontSize,font:isBold?bold:font,color:rgb(.12,.14,.18),maxWidth})
        y-=lineHeight
      }
      const wrap=(value:string,face=font,isBold=false)=>{
        const words=value.split(/\s+/).filter(Boolean);let line=''
        for(const word of words){
          const candidate=line?line+' '+word:word
          if(face.widthOfTextAtSize(candidate,fontSize)<=maxWidth){line=candidate;continue}
          if(line)drawLine(line,isBold)
          if(face.widthOfTextAtSize(word,fontSize)<=maxWidth){line=word;continue}
          let chunk=''
          for(const char of word){if(face.widthOfTextAtSize(chunk+char,fontSize)>maxWidth&&chunk){drawLine(chunk,isBold);chunk=char}else chunk+=char}
          line=chunk
        }
        if(line)drawLine(line,isBold)
      }
      for(const paragraph of paragraphs){
        const properties=paragraph.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','pPr')[0]
        const isBold=!!properties?.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','b')[0]
        const pieces:string[]=[]
        const walk=(node:Node)=>{
          if(node.nodeType===Node.TEXT_NODE){pieces.push(node.nodeValue||'');return}
          if(node.nodeType!==Node.ELEMENT_NODE)return
          const element=node as Element,local=element.localName
          if(local==='tab'){pieces.push('    ');return}
          if(local==='br'){pieces.push('\n');return}
          if(local==='t'){pieces.push(element.textContent||'');return}
          for(const child of Array.from(node.childNodes))walk(child)
        }
        for(const child of Array.from(paragraph.childNodes))walk(child)
        const text=pieces.join('').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim()
        if(text){extracted+=text.length;for(const line of text.split('\n'))wrap(line,isBold?bold:font,isBold)}
        y-=6
        if(y<margin+lineHeight)newPage()
      }
      if(!extracted)throw new Error('No readable text was found in this Word document.')
      return blobResult(await pdfBlob(pdf),'converted-document.pdf','pdf')
    }
    case 'pdf-to-word':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs')
      pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl
      const loading=pdfjs.getDocument({data:await file.arrayBuffer(),enableXfa:false})
      try{
        const doc=await loading.promise
        if(doc.numPages>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`)
        const xmlEscape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
        const paragraphs:string[]=[]
        let extracted=0
        for(let n=1;n<=doc.numPages;n++){
          const page=await doc.getPage(n),content=await page.getTextContent()
          const line=(content.items as any[]).map(item=>typeof item.str==='string'?item.str+(item.hasEOL?'\n':' '):'').join('').replace(/[ \t]+\n/g,'\n').trim()
          if(line){extracted+=line.length;for(const part of line.split(/\n+/)){const value=xmlEscape(part.trim());if(value)paragraphs.push(`<w:p><w:r><w:t xml:space="preserve">${value}</w:t></w:r></w:p>`)}}
          if(n<doc.numPages)paragraphs.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
          page.cleanup()
        }
        if(!extracted)throw new Error('No selectable text was found. This may be a scanned PDF; use OCR on a text-recognized PDF first.')
        const zip=new JSZip()
        zip.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>')
        zip.folder('_rels')!.file('.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        zip.folder('word')!.file('document.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs.join('')}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`)
        zip.folder('word')!.file('styles.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr></w:style></w:styles>')
        zip.folder('word')!.folder('_rels')!.file('document.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>')
        const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:5}})
        return blobResult(new Blob([blob],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}),'converted-document.docx')
      }finally{await loading.destroy()}
    }
    case 'pdf-to-powerpoint':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const signature=new Uint8Array(await file.slice(0,5).arrayBuffer())
      if(signature[0]!==0x25||signature[1]!==0x50||signature[2]!==0x44||signature[3]!==0x46)throw new Error('Upload a valid PDF file.')
      const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs')
      pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl
      const loading=pdfjs.getDocument({data:await file.arrayBuffer(),enableXfa:false})
      try{
        const doc=await loading.promise
        if(!doc.numPages)throw new Error('The PDF has no pages.')
        if(doc.numPages>50)throw new Error('PowerPoint export is limited to 50 PDF pages to keep the presentation manageable.')
        const zip=new JSZip()
        const slideIds:string[]=[]
        const slideRels:string[]=[]
        const contentTypes:string[]=[]
        let totalPixels=0,totalBytes=0
        const emu=914400,slideW=13.333333*emu,slideH=7.5*emu
        for(let n=1;n<=doc.numPages;n++){
          const page=await doc.getPage(n)
          const viewport=page.getViewport({scale:1.25})
          const w=Math.ceil(viewport.width),h=Math.ceil(viewport.height),pixels=w*h
          if(pixels>MAX_PDF_RENDER_PIXELS||totalPixels+pixels>MAX_PDF_TOTAL_RENDER_PIXELS){page.cleanup();throw new Error('PDF rendering exceeds the safe pixel limit for this browser. Try a smaller PDF or fewer pages.')}
          totalPixels+=pixels
          const canvas=makeCanvas(w,h)
          const ctx=canvas.getContext('2d')
          if(!ctx){page.cleanup();throw new Error('Canvas is unavailable in this browser.')}
          ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h)
          await page.render({canvas,viewport,background:'#ffffff'}).promise
          const jpg=await canvasBlob(canvas,'image/jpeg',0.88)
          canvas.width=0;canvas.height=0;page.cleanup()
          totalBytes+=jpg.size
          if(totalBytes>MAX_ARCHIVE_OUTPUT_BYTES)throw new Error('The PowerPoint would exceed the 120 MB safe output limit.')
          const imageName='image'+n+'.jpg'
          zip.file('ppt/media/'+imageName,jpg)
          const relId='rId'+(n+1)
          const imageRelId='rId2'
          const sw=slideW,sh=slideH,ratio=Math.min(sw/w,sh/h),drawW=Math.round(w*ratio),drawH=Math.round(h*ratio),x=Math.round((sw-drawW)/2),y=Math.round((sh-drawH)/2)
          const slideXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:pic><p:nvPicPr><p:cNvPr id="2" name="PDF page '+n+'"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="'+imageRelId+'"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="'+x+'" y="'+y+'"/><a:ext cx="'+drawW+'" cy="'+drawH+'"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>'
          zip.file('ppt/slides/slide'+n+'.xml',slideXml)
          zip.file('ppt/slides/_rels/slide'+n+'.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/'+imageName+'"/></Relationships>')
          slideIds.push('<p:sldId id="'+(255+n)+'" r:id="'+relId+'"/>')
          slideRels.push('<Relationship Id="'+relId+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide'+n+'.xml"/>')
          contentTypes.push('<Override PartName="/ppt/slides/slide'+n+'.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>')
        }
        zip.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/><Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/><Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'+contentTypes.join('')+'</Types>')
        zip.folder('_rels')!.file('.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>')
        zip.file('ppt/presentation.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>'+slideIds.join('')+'</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr></p:defaultTextStyle></p:presentation>')
        zip.folder('ppt')!.folder('_rels')!.file('presentation.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>'+slideRels.join('')+'<Relationship Id="rId1001" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/><Relationship Id="rId1002" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/><Relationship Id="rId1003" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/></Relationships>')
        zip.file('ppt/slideMasters/slideMaster1.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap accent1="4F81BD" accent2="C0504D" accent3="9BBB59" accent4="8064A2" accent5="4BACC6" accent6="F79646" bg1="lt1" bg2="lt2" tx1="dk1" tx2="dk2" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>')
        zip.folder('ppt/slideMasters')!.folder('_rels')!.file('slideMaster1.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>')
        zip.file('ppt/slideLayouts/slideLayout1.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>')
        zip.folder('ppt/slideLayouts')!.folder('_rels')!.file('slideLayout1.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>')
        zip.file('ppt/theme/theme1.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="AP Tools"><a:themeElements><a:clrScheme name="AP Tools"><a:dk1><a:srgbClr val="000000"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F1F1F"/></a:dk2><a:lt2><a:srgbClr val="F2F2F2"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Arial"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="AP Tools"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:alpha val="95000"/></a:schemeClr></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:alpha val="90000"/></a:schemeClr></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:alpha val="95000"/></a:schemeClr></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:alpha val="90000"/></a:schemeClr></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>')
        zip.file('ppt/presProps.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>')
        zip.file('ppt/viewProps.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" lastView="sldThumbnailView"><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr snapToGrid="0" snapToObjects="1"><p:cViewPr varScale="1"><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr><p:guideLst/></p:cSldViewPr></p:slideViewPr><p:notesTextViewPr><p:cViewPr><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:notesTextViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>')
        zip.file('ppt/tableStyles.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>')
        zip.file('docProps/core.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Converted PDF presentation</dc:title><dc:creator>AP Creative Tools</dc:creator><cp:lastModifiedBy>AP Creative Tools</cp:lastModifiedBy></cp:coreProperties>')
        zip.file('docProps/app.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>AP Creative Tools</Application><PresentationFormat>On-screen Show (16:9)</PresentationFormat><Slides>'+doc.numPages+'</Slides></Properties>')

        const output=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:4}})
        // Re-open and validate the complete package before offering a PowerPoint download.
        const checked=await JSZip.loadAsync(output,{checkCRC32:true})
        const requiredParts=['[Content_Types].xml','_rels/.rels','ppt/presentation.xml','ppt/_rels/presentation.xml.rels','ppt/presProps.xml','ppt/viewProps.xml','ppt/tableStyles.xml','ppt/theme/theme1.xml','ppt/slideMasters/slideMaster1.xml','ppt/slideMasters/_rels/slideMaster1.xml.rels','ppt/slideLayouts/slideLayout1.xml','ppt/slideLayouts/_rels/slideLayout1.xml.rels','docProps/core.xml','docProps/app.xml']
        for(const part of requiredParts)if(!checked.file(part))throw new Error('PowerPoint package validation failed: missing '+part)
        for(let n=1;n<=doc.numPages;n++)for(const part of ['ppt/slides/slide'+n+'.xml','ppt/slides/_rels/slide'+n+'.xml.rels','ppt/media/image'+n+'.jpg'])if(!checked.file(part))throw new Error('PowerPoint package validation failed: missing '+part)
        for(const part of Object.keys(checked.files).filter(name=>name.endsWith('.xml')||name.endsWith('.rels'))){const xml=await checked.file(part)!.async('text');const parsed=new DOMParser().parseFromString(xml,'application/xml');if(parsed.getElementsByTagName('parsererror').length)throw new Error('PowerPoint package validation failed: invalid XML in '+part)}
        return blobResult(new Blob([output],{type:'application/vnd.openxmlformats-officedocument.presentationml.presentation'}),'converted-presentation.pptx')
      }finally{await loading.destroy()}
    }
    case 'powerpoint-to-pdf':{
      fileRequired(files);assertFileSize(file,80*1024*1024)
      if(!/\.pptx$/i.test(file.name))throw new Error('Upload a PowerPoint .pptx file. Legacy .ppt files are not supported.')
      const signature=new Uint8Array(await file.slice(0,4).arrayBuffer())
      if(signature[0]!==0x50||signature[1]!==0x4b)throw new Error('This file is not a valid PowerPoint .pptx archive.')
      const zip=await JSZip.loadAsync(file,{checkCRC32:true})
      const entries=Object.values(zip.files)
      if(entries.length>1000)throw new Error('This presentation contains too many archive entries to process safely.')
      const declaredBytes=entries.reduce((sum,entry)=>sum+(((entry as unknown as {_data?:{uncompressedSize?:number}})._data?.uncompressedSize)||0),0)
      if(declaredBytes>200*1024*1024)throw new Error('The expanded PowerPoint archive exceeds the 200 MB safety limit.')
      if(!zip.file('[Content_Types].xml')||!zip.file('ppt/presentation.xml'))throw new Error('This file is missing required PowerPoint presentation parts.')
      const slidePaths=Object.keys(zip.files).filter(name=>/^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a,b)=>Number(a.match(/slide(\d+)/)?.[1])-Number(b.match(/slide(\d+)/)?.[1]))
      if(!slidePaths.length)throw new Error('No PowerPoint slides were found. Make sure this is a valid .pptx file.')
      if(slidePaths.length>100)throw new Error('PowerPoint conversion is limited to 100 slides per file.')
      const pdf=await PDFDocument.create()
      const pageW=960,pageH=540
      let embeddedBytes=0
      for(const slidePath of slidePaths){
        const slideFile=zip.file(slidePath)
        if(!slideFile)continue
        const xml=await slideFile.async('text')
        if(xml.length>5*1024*1024)throw new Error('A slide XML part exceeds the 5 MB safety limit.')
        const slideDoc=new DOMParser().parseFromString(xml,'application/xml')
        if(slideDoc.getElementsByTagName('parsererror').length)throw new Error('A slide contains invalid XML and could not be read.')
        const relPath=slidePath.replace('slides/','slides/_rels/')+'.rels'
        const relFile=zip.file(relPath)
        const relXml=relFile?await relFile.async('text'):undefined
        if(relXml&&relXml.length>2*1024*1024)throw new Error('A slide relationship file exceeds the 2 MB safety limit.')
        let imageBytes:Uint8Array|undefined
        let imageKind:'jpg'|'png'|undefined
        if(relXml){
          const relDoc=new DOMParser().parseFromString(relXml,'application/xml')
          const imageRel=Array.from(relDoc.getElementsByTagName('Relationship')).find(el=>(el.getAttribute('Type')||'').endsWith('/image'))
          if(imageRel){
            const target=imageRel.getAttribute('Target')||''
            if(!target||target.startsWith('/')||/^[a-z]+:/i.test(target)||target.includes('\\'))throw new Error('The presentation contains an unsupported external or unsafe image relationship.')
            const base=slidePath.slice(0,slidePath.lastIndexOf('/')+1)
            const parts=(base+target).split('/')
            const resolved:string[]=[]
            for(const part of parts){if(!part||part==='.')continue;if(part==='..')resolved.pop();else resolved.push(part)}
            if(!resolved.join('/').startsWith('ppt/media/'))throw new Error('A slide image points outside the PowerPoint media folder.')
            const media=zip.file(resolved.join('/'))
            if(media){
              const bytes=await media.async('uint8array')
              embeddedBytes+=bytes.byteLength
              if(embeddedBytes>MAX_ARCHIVE_OUTPUT_BYTES)throw new Error('Extracted slide images exceed the safe 120 MB limit.')
              const ext=resolved[resolved.length-1].toLowerCase()
              if(ext.endsWith('.jpg')||ext.endsWith('.jpeg')){imageBytes=bytes;imageKind='jpg'}
              else if(ext.endsWith('.png')){imageBytes=bytes;imageKind='png'}
            }
          }
        }
        const page=pdf.addPage([pageW,pageH])
        page.drawRectangle({x:0,y:0,width:pageW,height:pageH,color:rgb(1,1,1)})
        if(imageBytes&&imageKind&&slideDoc.getElementsByTagName('a:t').length===0){
          const image=imageKind==='jpg'?await pdf.embedJpg(imageBytes):await pdf.embedPng(imageBytes)
          const scale=Math.min(pageW/image.width,pageH/image.height)
          const width=image.width*scale,height=image.height*scale
          page.drawImage(image,{x:(pageW-width)/2,y:(pageH-height)/2,width,height})
        }else{
          const doc=slideDoc
          const lines=Array.from(doc.getElementsByTagName('a:t')).map(el=>(el.textContent||'').trim()).filter(Boolean)
          const font=await pdf.embedFont(StandardFonts.Helvetica)
          const bold=await pdf.embedFont(StandardFonts.HelveticaBold)
          let y=pageH-48
          for(const line of lines){
            const safe=line.replace(/[^\x20-\x7E]/g,'?')
            const chunks=safe.match(/.{1,105}(?:\s|$)|.{1,105}/g)||[safe]
            for(const chunk of chunks){
              if(y<32)break
              page.drawText(chunk.trim(),{x:40,y,size:14,font:bold,maxWidth:pageW-80,lineHeight:18,color:rgb(0.12,0.14,0.18)})
              y-=20
            }
            y-=8
            if(y<32)break
          }
          if(!lines.length)page.drawText('This slide contains graphics or elements that could not be rendered by the browser converter.',{x:40,y:pageH/2,size:14,font,maxWidth:pageW-80,color:rgb(0.35,0.35,0.35)})
        }
      }
      const bytes=await pdf.save({useObjectStreams:true})
      if(bytes.byteLength>MAX_ARCHIVE_OUTPUT_BYTES)throw new Error('The converted PDF exceeds the 120 MB output limit.')
      return blobResult(new Blob([bytes],{type:'application/pdf'}),safeName(file.name.replace(/\.pptx$/i,'')||'presentation')+'.pdf','pdf')
    }
    case 'pdf-images':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs')
      pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl
      const loading=pdfjs.getDocument({data:await file.arrayBuffer(),enableXfa:false})
      try {
        const doc=await loading.promise
        if(doc.numPages>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`)
        const out:{name:string;data:Blob}[]=[];let renderedPixels=0,outputBytes=0
        for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n);const vp=page.getViewport({scale:1.5});const pixels=vp.width*vp.height;if(pixels>MAX_PDF_RENDER_PIXELS||renderedPixels+pixels>MAX_PDF_TOTAL_RENDER_PIXELS){page.cleanup();throw new Error(`PDF rendering is limited to ${MAX_PDF_TOTAL_RENDER_PIXELS.toLocaleString()} total page pixels.`)}renderedPixels+=pixels;const canvas=makeCanvas(Math.ceil(vp.width),Math.ceil(vp.height));await page.render({canvas,viewport:vp}).promise;const jpg=await canvasBlob(canvas,'image/jpeg',0.9);canvas.width=0;canvas.height=0;page.cleanup();outputBytes+=jpg.size;if(outputBytes>MAX_ARCHIVE_OUTPUT_BYTES)throw new Error('Rendered PDF images exceed the 120 MB output limit.');out.push({name:`page-${n}.jpg`,data:jpg})}
        return blobResult(await downloadZip(out),'pdf-pages-images.zip')
      } finally { await loading.destroy() }
    }
    case 'images-pdf':case 'image-pdf':{
      fileRequired(files);if(files.length>50)throw new Error('Choose no more than 50 images.');assertFilesSize(files,80*1024*1024);const pdf=await PDFDocument.create()
      let totalPixels=0;for(const f of files){assertFileSize(f);const signature=new Uint8Array(await f.slice(0,8).arrayBuffer());const isPng=[137,80,78,71,13,10,26,10].every((value,index)=>signature[index]===value);const isJpeg=signature[0]===255&&signature[1]===216&&signature[2]===255;if(!isPng&&!isJpeg)throw new Error(`${f.name}: only valid PNG and JPEG images are supported.`);const bitmap=await getImage(f);totalPixels+=bitmap.width*bitmap.height;bitmap.close();if(totalPixels>MAX_PDF_TOTAL_RENDER_PIXELS)throw new Error('Images exceed the safe combined image-pixel limit for PDF creation.');const bytes=await f.arrayBuffer();const img=isPng?await pdf.embedPng(bytes):await pdf.embedJpg(bytes);const p=pdf.addPage([img.width,img.height]);p.drawImage(img,{x:0,y:0,width:img.width,height:img.height})}
      return blobResult(await pdfBlob(pdf),'images.pdf','pdf')
    }
    case 'pdf-text':{
      fileRequired(files);assertFileSize(file,60*1024*1024);const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs')
      pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl
      const loading=pdfjs.getDocument({data:await file.arrayBuffer(),enableXfa:false})
      try {
        const doc=await loading.promise
        if(doc.numPages>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`)
        const parts:string[]=[];let totalChars=0
        for(let n=1;n<=doc.numPages;n++){const page=await doc.getPage(n);try{const c=await page.getTextContent();const pageText=c.items.map((x:any)=>'str'in x?x.str:'').join(' ');totalChars+=pageText.length;if(totalChars>10_000_000)throw new Error('Extracted PDF text exceeds the 10 MB output limit.');parts.push(`--- Page ${n} ---\n${pageText}`)}finally{page.cleanup()}}
        return textResult(parts.join('\n\n'))
      } finally { await loading.destroy() }
    }
    case 'pdf-watermark':{
      if(input.length>500)throw new Error('Watermark text is limited to 500 characters.');fileRequired(files);assertFileSize(file,60*1024*1024);const pdf=await PDFDocument.load(await file.arrayBuffer());if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`);const font=await pdf.embedFont(StandardFonts.Helvetica)
      for(const p of pdf.getPages()){const {width,height}=p.getSize();p.drawText(input||'AP TOOLS',{x:width*.2,y:height*.5,size:30,font,color:rgb(.65,.65,.65),opacity:.35,rotate:degrees(-35)})}
      return blobResult(await pdfBlob(pdf),'watermarked.pdf','pdf')
    }
    case 'pdf-rotate':{
      fileRequired(files);assertFileSize(file,60*1024*1024);const pdf=await PDFDocument.load(await file.arrayBuffer());if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`);const deg=Number(input||90)
      if(![90,180,270,-90,-180,-270].includes(deg))throw new Error('Enter 90, 180 or 270 degrees.')
      pdf.getPages().forEach(p=>p.setRotation(degrees(((p.getRotation().angle+deg)%360+360)%360)))
      return blobResult(await pdfBlob(pdf),'rotated.pdf','pdf')
    }
    case 'pdf-info':case 'pdf-page-numbers':case 'pdf-inspector':{
      fileRequired(files);assertFileSize(file,60*1024*1024);const pdf=await PDFDocument.load(await file.arrayBuffer());if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error(`PDFs are limited to ${MAX_PDF_PAGES} pages.`)
      if(id==='pdf-info'||id==='pdf-inspector')return textResult(`Pages: ${pdf.getPageCount()}\nTitle: ${pdf.getTitle()||'—'}\nAuthor: ${pdf.getAuthor()||'—'}\nSubject: ${pdf.getSubject()||'—'}\nPage sizes:\n${pdf.getPages().map((p,i)=>`Page ${i+1}: ${Math.round(p.getWidth())} × ${Math.round(p.getHeight())} pt`).join('\n')}`)
      const font=await pdf.embedFont(StandardFonts.Helvetica)
      pdf.getPages().forEach((p,i)=>{const {width}=p.getSize();p.drawText(String(i+1),{x:width-45,y:18,size:10,font,color:rgb(.35,.35,.35)})})
      return blobResult(await pdfBlob(pdf),'numbered.pdf','pdf')
    }

    case 'pdf-remove-pages':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const pdf=await PDFDocument.load(await file.arrayBuffer())
      const count=pdf.getPageCount()
      if(count>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      if(!input.trim()||!/^\d+(?:\s*,\s*\d+)*$/.test(input.trim()))throw new Error('Enter page numbers to remove, separated by commas, e.g. 2,4.')
      const indexes=[...new Set(input.split(',').map(x=>Number(x.trim())-1))]
      if(indexes.some(n=>!Number.isInteger(n)||n<0||n>=count))throw new Error('One or more page numbers do not exist in this PDF.')
      if(indexes.length>=count)throw new Error('A PDF must contain at least one page.')
      indexes.sort((a,b)=>b-a).forEach(index=>pdf.removePage(index))
      return blobResult(await pdfBlob(pdf),'pages-removed.pdf','pdf')
    }
    case 'pdf-organize-pages':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const src=await PDFDocument.load(await file.arrayBuffer()),count=src.getPageCount()
      if(count>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      if(!input.trim()||!/^\d+(?:\s*,\s*\d+)*$/.test(input.trim()))throw new Error('Enter every page number in the new order, separated by commas, e.g. 3,1,2.')
      const order=input.split(',').map(x=>Number(x.trim())-1)
      if(order.length!==count||new Set(order).size!==count||order.some(n=>!Number.isInteger(n)||n<0||n>=count))throw new Error('Enter each page exactly once. This PDF contains '+count+' pages.')
      const out=await PDFDocument.create()
      const copied=await out.copyPages(src,order)
      copied.forEach(page=>out.addPage(page))
      return blobResult(await pdfBlob(out),'organized.pdf','pdf')
    }
    case 'pdf-split-every-page':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const src=await PDFDocument.load(await file.arrayBuffer()),count=src.getPageCount()
      if(count>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      const items:{name:string;data:Blob}[]=[]
      for(let i=0;i<count;i++){
        const out=await PDFDocument.create()
        const [page]=await out.copyPages(src,[i]);out.addPage(page)
        items.push({name:'page-'+String(i+1).padStart(3,'0')+'.pdf',data:await pdfBlob(out)})
      }
      return blobResult(await downloadZip(items),'pdf-pages.zip')
    }
    case 'pdf-header-footer':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      if(input.length>600)throw new Error('Header and footer text are limited to 600 characters total.')
      const [header='',footer='']=input.split('|')
      if(header.length>250||footer.length>250)throw new Error('Each header/footer line is limited to 250 characters.')
      if(!header.trim()&&!footer.trim())throw new Error('Enter header text, footer text, or both. Separate them with |.')
      const pdf=await PDFDocument.load(await file.arrayBuffer())
      if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      const font=await pdf.embedFont(StandardFonts.Helvetica)
      for(const page of pdf.getPages()){
        const {width,height}=page.getSize()
        if(header.trim())page.drawText(header,{x:36,y:height-28,size:9,font,color:rgb(.25,.25,.25),maxWidth:width-72})
        if(footer.trim())page.drawText(footer,{x:36,y:18,size:9,font,color:rgb(.25,.25,.25),maxWidth:width-72})
      }
      return blobResult(await pdfBlob(pdf),'header-footer.pdf','pdf')
    }
    case 'pdf-metadata-editor':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      if(input.length>10000)throw new Error('Metadata JSON is limited to 10 KB.')
      let values:Record<string,unknown>
      try{values=JSON.parse(input)}catch{throw new Error('Enter valid JSON with title, author, subject and/or keywords fields.')}
      if(!values||typeof values!=='object'||Array.isArray(values))throw new Error('Metadata must be a JSON object.')
      const allowed=['title','author','subject','keywords','creator','producer']
      if(Object.keys(values).some(key=>!allowed.includes(key)))throw new Error('Supported metadata fields: '+allowed.join(', ')+'.')
      for(const [key,value] of Object.entries(values)){
        if(key==='keywords'){
          if(!(typeof value==='string'||Array.isArray(value)&&value.every(x=>typeof x==='string')))throw new Error('keywords must be a string or an array of strings.')
          if((Array.isArray(value)?value.join(','):value as string).length>2000)throw new Error('Keywords are limited to 2,000 characters.')
        }else if(typeof value!=='string'||value.length>1000)throw new Error(key+' must be a string of at most 1,000 characters.')
      }
      const pdf=await PDFDocument.load(await file.arrayBuffer())
      if(typeof values.title==='string')pdf.setTitle(values.title)
      if(typeof values.author==='string')pdf.setAuthor(values.author)
      if(typeof values.subject==='string')pdf.setSubject(values.subject)
      if(typeof values.creator==='string')pdf.setCreator(values.creator)
      if(typeof values.producer==='string')pdf.setProducer(values.producer)
      if(typeof values.keywords==='string')pdf.setKeywords(values.keywords.split(',').map(x=>x.trim()).filter(Boolean))
      if(Array.isArray(values.keywords))pdf.setKeywords(values.keywords as string[])
      pdf.setModificationDate(new Date())
      return blobResult(await pdfBlob(pdf),'metadata-updated.pdf','pdf')
    }
    case 'pdf-crop':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const values=input.split(',').map(x=>Number(x.trim()))
      if(values.length!==4||values.some(x=>!Number.isFinite(x))||values[0]<0||values[1]<0||values[2]<=0||values[3]<=0)throw new Error('Enter crop x,y,width,height in PDF points, e.g. 20,20,550,750.')
      const [x,y,width,height]=values
      const pdf=await PDFDocument.load(await file.arrayBuffer())
      if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      for(const page of pdf.getPages()){
        const size=page.getSize()
        if(x+width>size.width||y+height>size.height)throw new Error('Crop rectangle must fit inside every page. Page sizes may differ.')
        page.setCropBox(x,y,width,height)
      }
      return blobResult(await pdfBlob(pdf),'cropped.pdf','pdf')
    }
    case 'pdf-flatten-forms':{
      fileRequired(files);assertFileSize(file,60*1024*1024)
      const pdf=await PDFDocument.load(await file.arrayBuffer())
      if(pdf.getPageCount()>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
      const form=pdf.getForm(),fields=form.getFields()
      if(!fields.length)throw new Error('This PDF has no supported AcroForm fields to flatten.')
      form.flatten()
      return blobResult(await pdfBlob(pdf),'flattened-forms.pdf','pdf')
    }
    case 'pdf-compare':{
      if(files.length!==2)throw new Error('Choose exactly two PDF documents to compare.')
      assertFilesSize(files,120*1024*1024)
      const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs')
      pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl
      const extract=async(source:File)=>{
        assertFileSize(source,60*1024*1024)
        const loading=pdfjs.getDocument({data:await source.arrayBuffer(),enableXfa:false})
        try{
          const doc=await loading.promise
          if(doc.numPages>MAX_PDF_PAGES)throw new Error('PDFs are limited to 250 pages.')
          const pages:string[]=[];let total=0
          for(let n=1;n<=doc.numPages;n++){
            const page=await doc.getPage(n)
            try{
              const result=await page.getTextContent()
              const value=result.items.map((item:any)=>'str'in item?item.str:'').join(' ')
              total+=value.length
              if(total>5_000_000)throw new Error('Extracted text is limited to 5 MB per PDF.')
              pages.push(value)
            }finally{page.cleanup()}
          }
          return pages.join('\n')
        }finally{await loading.destroy()}
      }
      const first=await extract(files[0]),second=await extract(files[1])
      if(first===second)return textResult('The selectable text in these PDFs is identical.')
      return textResult('The selectable text differs.\\n\\n'+compareTextLines(first.split(/\r?\n/),second.split(/\r?\n/))+'\\n\\nNote: this compares selectable text, not visual layout, images or scanned pages.')
    }

    // IMAGE
    case 'image-compress':case 'image-resize':case 'image-crop':case 'image-convert':case 'image-rotate':case 'image-flip':case 'image-grayscale':case 'image-watermark':case 'image-base64':case 'base64-image':case 'image-color':case 'image-metadata':case 'favicon':case 'image-collage':{
      if(id==='base64-image'){
        const data=input.trim();return blobResult(await downloadDataUrlBlob(data),'decoded-image','image')
      }
      if(id==='image-collage'){
        fileRequired(files,2);if(files.length>50)throw new Error('Choose no more than 50 images for a collage.');assertFilesSize(files,80*1024*1024);const cellW=320,cellH=220,cols=Math.ceil(Math.sqrt(files.length)),rows=Math.ceil(files.length/cols)
        const c=makeCanvas(cols*cellW,rows*cellH),ctx=c.getContext('2d')!;ctx.fillStyle='#f1f5f9';ctx.fillRect(0,0,c.width,c.height);let totalPixels=0
        for(let i=0;i<files.length;i++){const b=await getImage(files[i]);totalPixels+=b.width*b.height;if(totalPixels>MAX_PDF_TOTAL_RENDER_PIXELS){b.close();throw new Error('Collage inputs exceed the safe combined image-pixel limit.')}const x=(i%cols)*cellW,y=Math.floor(i/cols)*cellH,scale=Math.min(cellW/b.width,cellH/b.height);ctx.drawImage(b,x+(cellW-b.width*scale)/2,y+(cellH-b.height*scale)/2,b.width*scale,b.height*scale);b.close()}
        return blobResult(await canvasBlob(c),'collage.png','image')
      }
      fileRequired(files)
      const bitmap=await getImage(file)
      if(id==='image-metadata') {const info=`Name: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\nWidth: ${bitmap.width}px\nHeight: ${bitmap.height}px\nAspect ratio: ${(bitmap.width/bitmap.height).toFixed(3)}`;bitmap.close();return textResult(info)}
      if(id==='image-color'){
        const [x,y]=input.split(',').map(Number);const bw=bitmap.width,bh=bitmap.height;if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=bw||y>=bh){bitmap.close();throw new Error(`Enter pixel coordinates inside this image (0–${bw-1}, 0–${bh-1}).`)}
        const c=makeCanvas(bw,bh),ctx=c.getContext('2d')!;ctx.drawImage(bitmap,0,0);bitmap.close()
        const d=ctx.getImageData(x,y,1,1).data
        return textResult(`RGBA: ${d[0]}, ${d[1]}, ${d[2]}, ${d[3]}\nHEX: #${[...d].slice(0,3).map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase()}`)
      }
      if(id==='image-base64'){if(file.size>15*1024*1024){bitmap.close();throw new Error('Base64 image output is limited to 15 MB of source data.')}bitmap.close();return textResult(await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('Could not read image.'));r.readAsDataURL(file)}))}
      const maxW=id==='favicon'?64:Number(opts.width||1200),maxH=id==='favicon'?64:Number(opts.height||1200),quality=Number(opts.quality||80)/100
      if(!Number.isFinite(quality)||quality<0.1||quality>1||!Number.isFinite(maxW)||!Number.isFinite(maxH)||maxW<1||maxH<1||maxW>12000||maxH>12000){bitmap.close();throw new Error('Image dimensions must be 1–12,000 px and quality must be 10–100%.')}
      let sx=0,sy=0,sw=bitmap.width,sh=bitmap.height
      if(id==='image-crop'){const parts=input.split(',').map(Number);if(parts.length!==4||parts.some(n=>!Number.isFinite(n)||!Number.isInteger(n))){bitmap.close();throw new Error('Enter crop as whole-number x,y,width,height values.')}[sx,sy,sw,sh]=parts;if(sw<=0||sh<=0||sx<0||sy<0||sx+sw>bitmap.width||sy+sh>bitmap.height){bitmap.close();throw new Error('Crop area is outside the image.')}}
      const scale=(id==='image-resize'||id==='image-compress'||id==='favicon')?Math.min(maxW/sw,maxH/sh,1):1
      const w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale))
      const rotate=id==='image-rotate'?Number(secondary||90):0
      if(id==='image-rotate'&&![90,180,270,-90,-180,-270].includes(rotate)){bitmap.close();throw new Error('Enter 90, 180 or 270 degrees.') }
      const type=id==='favicon'?'image/png':String(opts.format||'image/webp')
      if(!['image/png','image/jpeg','image/webp'].includes(type)){bitmap.close();throw new Error('Choose PNG, JPEG or WebP output.')}
      const c=makeCanvas(rotate%180!==0?h:w,rotate%180!==0?w:h),ctx=c.getContext('2d')!
      ctx.save();ctx.translate(c.width/2,c.height/2)
      if(type==='image/jpeg'){ctx.fillStyle='#ffffff';ctx.fillRect(-c.width/2,-c.height/2,c.width,c.height)}
      if(rotate)ctx.rotate(rotate*Math.PI/180);if(id==='image-flip')ctx.scale(secondary==='vertical'?1:-1,secondary==='vertical'?-1:1);if(id==='image-grayscale')ctx.filter='grayscale(1)'
      ctx.drawImage(bitmap,sx,sy,sw,sh,-w/2,-h/2,w,h)
      if(id==='image-watermark'&&secondary.length>500){bitmap.close();throw new Error('Image watermark text is limited to 500 characters.')}if(id==='image-watermark'){ctx.filter='none';ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='bold 24px sans-serif';ctx.textAlign='right';ctx.fillText(secondary||'AP TOOLS',w/2-12,h/2-14)}
      ctx.restore();bitmap.close()
      const blob=await canvasBlob(c,type,quality);const actualType=blob.type||'image/png';const ext=actualType==='image/jpeg'?'jpg':actualType.split('/')[1]||'png'
      return blobResult(blob,id==='favicon'?'favicon.png':`processed.${ext}`,'image')
    }

    // TEXT
    case 'word-counter':return textResult(`Words: ${input.trim()?input.trim().split(/\s+/).length:0}\nCharacters: ${input.length}\nCharacters without spaces: ${input.replace(/\s/g,'').length}\nLines: ${input?input.split(/\r?\n/).length:0}\nSentences: ${(input.match(/[.!?]+/g)||[]).length}\nParagraphs: ${input.trim()?input.trim().split(/\n\s*\n/).length:0}\nReading time: ${Math.ceil((input.trim()?input.trim().split(/\s+/).length:0)/200)} min`)
    case 'case-converter':return textResult(secondary==='lower'?input.toLowerCase():secondary==='title'?input.toLowerCase().replace(/\b\w/g,x=>x.toUpperCase()):secondary==='sentence'?input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,x=>x.toUpperCase()):input.toUpperCase())
    case 'remove-spaces':return textResult(input.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim())
    case 'duplicate-lines':return textResult([...new Set(input.split(/\r?\n/))].join('\n'))
    case 'sort-lines':return textResult(input.split(/\r?\n/).sort((a,b)=>a.localeCompare(b)).join('\n'))
    case 'reverse-text':return textResult(secondary==='words'?input.trim().split(/\s+/).reverse().join(' '):[...input].reverse().join(''))
    case 'text-diff':{if(input.length+secondary.length>10_000_000)throw new Error('Text comparison is limited to 10 MB total.');const a=input.split(/\r?\n/),b=secondary.split(/\r?\n/);return textResult(compareTextLines(a,b))}
    case 'slug-generator':return textResult(input.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s-]/g,'').trim().replace(/[\s_-]+/g,'-').replace(/^-+|-+$/g,''))
    case 'lorem':{const count=input.trim()?Number(input):3;if(!Number.isInteger(count)||count<1||count>30)throw new Error('Choose 1 to 30 paragraphs.');return textResult(Array.from({length:count},()=> 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.').join('\n\n'))}
    case 'markdown-preview':case 'markdown-html':return {kind:'html',value:mdToHtml(input)}
    case 'text-binary':if(input.length>250_000)throw new Error('Text-to-binary is limited to 250,000 characters.');return textResult([...new TextEncoder().encode(input)].map(b=>b.toString(2).padStart(8,'0')).join(' '))
    case 'binary-text':if(input.length>1_000_000)throw new Error('Binary input is limited to 1 MB.');return textResult(new TextDecoder().decode(new Uint8Array(input.trim().split(/\s+/).map(x=>{if(!/^[01]{8}$/.test(x))throw new Error('Use 8-bit binary groups separated by spaces.');return parseInt(x,2)}))))
    case 'text-morse':return textResult(input.toLowerCase().split('').map(c=>c===' '?'/' : morse[c]||'').join(' '))
    case 'morse-text':return textResult(input.trim().split(/\s+/).map(x=>x==='/'?' ':reverseMorse[x]||'?').join(' '))

    // DEVELOPER
    case 'json-format':if(input.length>10_000_000)throw new Error('JSON input is limited to 10 MB.');return textResult(JSON.stringify(JSON.parse(input),null,2))
    case 'json-minify':if(input.length>10_000_000)throw new Error('JSON input is limited to 10 MB.');return textResult(JSON.stringify(JSON.parse(input)))
    case 'json-csv':{if(input.length>10_000_000)throw new Error('JSON input is limited to 10 MB.');const data=JSON.parse(input);if(!Array.isArray(data)||data.length>100000||data.some((row:any)=>!row||typeof row!=='object'||Array.isArray(row)))throw new Error('JSON input must be an array of no more than 100,000 objects.');const safeCell=(value:any)=>typeof value==='string'&&/^[\s]*[=+\-@]/.test(value)?`'${value}`:value;const safeData=data.map((row:any)=>Object.fromEntries(Object.entries(row).map(([key,value])=>[safeCell(key),safeCell(value)])));return textResult(Papa.unparse(safeData))}
    case 'csv-json':{if(input.length>10_000_000)throw new Error('CSV input is limited to 10 MB.');const p=Papa.parse(input,{header:true,skipEmptyLines:true});if(p.errors.length)throw new Error(p.errors[0].message);return textResult(JSON.stringify(p.data,null,2))}
    case 'xml-escape':return textResult(input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'))
    case 'base64-encode':if(input.length>10_000_000)throw new Error('Base64 encoding is limited to 10 MB of text.');return textResult(utf8Base64(input))
    case 'base64-decode':return textResult(base64Utf8(input))
    case 'url-encode':return textResult(encodeURIComponent(input))
    case 'url-decode':return textResult(decodeURIComponent(input))
    case 'jwt-decode':{const parts=input.trim().split('.');if(parts.length!==3)throw new Error('A JWT must contain three dot-separated parts.');const decode=(s:string)=>JSON.stringify(JSON.parse(base64Utf8(s.replace(/-/g,'+').replace(/_/g,'/').replace(/[^a-z0-9+/=]/gi,''))),null,2);return textResult(`HEADER\n${decode(parts[0])}\n\nPAYLOAD\n${decode(parts[1])}\n\nSignature is not verified.`)}
    case 'uuid':{const count=input.trim()?Number(input):1;if(!Number.isInteger(count)||count<1||count>100)throw new Error('Enter a whole number from 1 to 100.');return textResult(Array.from({length:count},()=>crypto.randomUUID()).join('\n'))}
    case 'regex':{const flags=String(opts.flags||'g');const pattern=secondary;const text=input;if(!pattern||!text)throw new Error('Enter both test text and a regular expression.');if(pattern.length>500||text.length>200_000)throw new Error('Regex pattern is limited to 500 characters and test text to 200,000 characters.');if(!/^[dgimsuvy]*$/.test(flags)||new Set(flags).size!==flags.length||flags.includes('u')&&flags.includes('v'))throw new Error('Regex flags may contain unique d, g, i, m, s, u, v or y options.');return textResult(await runRegexInWorker(pattern,text,flags.includes('g')?flags:flags+'g'))}
    case 'timestamp':{const n=Number(input);if(!input.trim()||!Number.isFinite(n))throw new Error('Enter a valid Unix timestamp.');const d=new Date(Math.abs(n)<1e12?n*1000:n);if(Number.isNaN(d.getTime()))throw new Error('Enter a valid Unix timestamp.');return textResult(`ISO: ${d.toISOString()}\nLocal: ${d.toLocaleString()}\nUnix seconds: ${Math.floor(d.getTime()/1000)}\nUnix milliseconds: ${d.getTime()}`)}
    case 'html-minify':return textResult(input.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim())
    case 'css-gradient':return textResult(`background: linear-gradient(${secondary||'90deg'}, ${input||'#635BFF'}, #38BDF8);`)
    case 'css-shadow':return textResult(`box-shadow: ${input||'0 4px 16px rgba(0,0,0,.12)'};`)
    case 'color-convert':{
      const hex=input.trim().replace(/^#/,'');if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex))throw new Error('Enter a valid 3 or 6 digit HEX color.')
      const full=hex.length===3?hex.split('').map(x=>x+x).join(''):hex;const [r,g,b]=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16))
      const rn=r/255,gn=g/255,bn=b/255,max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn),d=max-min,l=(max+min)/2
      let h=0;if(d){if(max===rn)h=60*(((gn-bn)/d)%6);else if(max===gn)h=60*((bn-rn)/d+2);else h=60*((rn-gn)/d+4)}
      const s=d?d/(1-Math.abs(2*l-1)):0
      return textResult(`HEX: #${full.toUpperCase()}\nRGB: ${r}, ${g}, ${b}\nHSL: ${Math.round((h+360)%360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%`)
    }
    case 'random-string':{const chars=[...(input||'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')];if(new Set(chars).size!==chars.length)throw new Error('Character set must not contain duplicate characters.');const len=secondary.trim()?Number(secondary):24;if(!Number.isInteger(len)||len<1||len>256)throw new Error('Output length must be a whole number from 1 to 256.');return textResult(randomCharacters(chars.join(''),len))}
    case 'hash-text':return textResult(`SHA-256\n${await digest(new TextEncoder().encode(input))}`)
    case 'regex-escape':return textResult(input.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))
    case 'html-preview':if(input.length>5_000_000)throw new Error('HTML preview is limited to 5 MB.');return {kind:'html',value:`<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'"><meta name="referrer" content="no-referrer"></head><body>${input}</body></html>`}

    // CALCULATORS
    case 'calculator':return textResult(String(calculate(input)))
    case 'percentage':{const p=Number(input),r=Number(secondary);if(!input.trim()||!secondary.trim()||!Number.isFinite(p)||!Number.isFinite(r))throw new Error('Enter valid amount and percentage values.');const result=p*r/100;if(!Number.isFinite(result))throw new Error('Result is outside the supported numeric range.');return textResult(`${result.toFixed(4)} (${r}% of ${p})`)}
    case 'gst':{const p=Number(input),r=Number(secondary);if(!input.trim()||!secondary.trim()||!Number.isFinite(p)||!Number.isFinite(r)||p<0||r<0||r>100)throw new Error('Enter a non-negative amount and a GST rate from 0–100.');const tax=p*r/100,total=p*(1+r/100);if(!Number.isFinite(tax)||!Number.isFinite(total))throw new Error('Result is outside the supported numeric range.');return textResult(`GST amount: ${tax.toFixed(2)}\nTotal including GST: ${total.toFixed(2)}\nBase amount: ${p.toFixed(2)}`)}
    case 'discount':{const p=Number(input),r=Number(secondary);if(!input.trim()||!secondary.trim()||!Number.isFinite(p)||!Number.isFinite(r)||p<0||r<0||r>100)throw new Error('Enter a non-negative price and a discount from 0–100%.');const discount=p*r/100,total=p*(1-r/100);if(!Number.isFinite(discount)||!Number.isFinite(total))throw new Error('Result is outside the supported numeric range.');return textResult(`Discount: ${discount.toFixed(2)}\nFinal price: ${total.toFixed(2)}`)}
    case 'emi':{const values=input.split(',');if(values.length!==3)throw new Error('Enter principal, annual interest rate and months separated by commas.');const [p,r,n]=values.map(Number);if(!Number.isFinite(p)||!Number.isFinite(r)||!Number.isSafeInteger(n)||p<=0||n<=0||r<0||r>1000)throw new Error('Enter principal, annual interest rate, months (e.g. 500000,9,60).');const m=r/1200;const emi=m===0?p/n:p*m*Math.pow(1+m,n)/(Math.pow(1+m,n)-1);if(!Number.isFinite(emi)||!Number.isFinite(emi*n))throw new Error('Loan values produce a result outside the supported numeric range.');return textResult(`Monthly EMI: ${emi.toFixed(2)}\nTotal payment: ${(emi*n).toFixed(2)}\nTotal interest: ${(emi*n-p).toFixed(2)}`)}
    case 'simple-interest':{const values=input.split(',');if(values.length!==3)throw new Error('Enter principal, annual rate and time separated by commas.');const [p,r,t]=values.map(Number);if(![p,r,t].every(Number.isFinite)||p<0||r<0||t<0)throw new Error('Enter non-negative principal, annual rate and time values.');const interest=p*r*t/100,total=p+interest;if(!Number.isFinite(interest)||!Number.isFinite(total))throw new Error('Result is outside the supported numeric range.');return textResult(`Interest: ${interest.toFixed(2)}\nTotal amount: ${total.toFixed(2)}`)}
    case 'compound-interest':{const values=input.split(',');if(values.length!==3)throw new Error('Enter principal, annual rate and years separated by commas.');const [p,r,t]=values.map(Number);if(![p,r,t].every(Number.isFinite)||p<0||r<0||t<0||r>1000||t>1000)throw new Error('Enter valid non-negative principal, annual rate and years.');const total=p*Math.pow(1+r/100,t);if(!Number.isFinite(total))throw new Error('Result is outside the supported numeric range.');return textResult(`Interest: ${(total-p).toFixed(2)}\nTotal amount: ${total.toFixed(2)}`)}
    case 'age':{const born=parseDateOnly(input);if(!Number.isFinite(born))throw new Error('Enter a valid date of birth as YYYY-MM-DD.');const now=new Date(),today=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());if(born>today)throw new Error('Date of birth cannot be in the future.');const birth=new Date(born);let y=now.getFullYear()-birth.getUTCFullYear();if(now.getMonth()<birth.getUTCMonth()||(now.getMonth()===birth.getUTCMonth()&&now.getDate()<birth.getUTCDate()))y--;return textResult(`Age: ${y} years`)}
    case 'date-difference':{const values=input.split(',');if(values.length!==2)throw new Error('Enter two dates as YYYY-MM-DD,YYYY-MM-DD.');const [a,b]=values.map(parseDateOnly);if(!Number.isFinite(a)||!Number.isFinite(b))throw new Error('Enter two valid dates as YYYY-MM-DD.');const d=Math.abs(b-a);return textResult(`${Math.floor(d/86400000)} days\n${(d/604800000).toFixed(2)} weeks`)}
    case 'bmi':{const values=input.split(',');if(values.length!==2)throw new Error('Enter weight in kg and height in cm.');const [kg,cm]=values.map(Number);if(!Number.isFinite(kg)||!Number.isFinite(cm)||kg<=0||cm<=0)throw new Error('Enter valid weight in kg and height in cm.');const bmi=kg/Math.pow(cm/100,2);if(!Number.isFinite(bmi))throw new Error('BMI is outside the supported numeric range.');return textResult(`BMI: ${bmi.toFixed(1)}\nCategory: ${bmi<18.5?'Underweight':bmi<25?'Normal range':bmi<30?'Overweight':'Obesity range'}\nScreening estimate only; not a medical diagnosis.`)}
    case 'average':{
      const tokens=input.trim().split(/[ ,\s]+/);const a=tokens.map(Number)
      if(!input.trim()||a.length>100000||!a.every(Number.isFinite))throw new Error('Enter 1–100,000 valid numbers separated by commas or spaces.')
      a.sort((x,y)=>x-y)
      const sum=a.reduce((x,y)=>x+y,0),mean=sum/a.length
      if(!Number.isFinite(sum)||!Number.isFinite(mean))throw new Error('Average is outside the supported numeric range.')
      const frequencies=new Map<number,number>();let maxFrequency=0
      for(const value of a){const count=(frequencies.get(value)||0)+1;frequencies.set(value,count);if(count>maxFrequency)maxFrequency=count}
      const modes=maxFrequency>1?[...frequencies].filter(([,count])=>count===maxFrequency).map(([value])=>value):[]
      const modeText=modes.length?modes.slice(0,100).join(', ')+(modes.length>100?' (first 100 shown)':''):'No mode (all values occur once)'
      const median=a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2
      return textResult(`Count: ${a.length}\nMean: ${mean}\nMedian: ${median}\nMode: ${modeText}\nMinimum: ${a[0]}\nMaximum: ${a.at(-1)}`)
    }
    case 'ratio':{const values=input.split(':');if(values.length!==2)throw new Error('Enter a ratio like 12:18.');const [a,b]=values.map(Number);if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<0||!Number.isSafeInteger(a+b)||a+b===0)throw new Error('Enter a non-negative whole-number ratio like 12:18, with at least one value above zero.');const gcd=(x:number,y:number):number=>y?gcd(y,x%y):Math.abs(x);const g=gcd(a,b);return textResult(`Simplified ratio: ${a/g}:${b/g}\nFirst share: ${(a/(a+b)*100).toFixed(2)}%\nSecond share: ${(b/(a+b)*100).toFixed(2)}%`)}
    case 'unit-length':case 'unit-weight':case 'unit-temp':case 'unit-data':case 'unit-speed':{
      const values=input.split(',');if(values.length!==2)throw new Error('Enter a value and one unit separated by a comma.');const [v,u0]=values;const n=Number(v),u=(u0||'').trim();if(!Number.isFinite(n)||!v.trim())throw new Error('Enter a valid numeric value and a unit.')
      const maps:Record<string,Record<string,number>>={
        'unit-length':{mm:.001,cm:.01,m:1,km:1000,in:.0254,ft:.3048,yd:.9144,mi:1609.344},
        'unit-weight':{mg:.000001,g:.001,kg:1,tonne:1000,lb:.45359237,oz:.0283495},
        'unit-data':{B:1,KB:1000,MB:1e6,GB:1e9,TB:1e12,KiB:1024,MiB:1048576,GiB:1073741824},
        'unit-speed':{'m/s':1,'km/h':1/3.6,mph:.44704,'knot':.514444}
      }
      if(id==='unit-temp'){if(!['c','f','k'].includes(u.toLowerCase()))throw new Error('Use C, F or K for temperature.');const c=u.toLowerCase()==='f'?(n-32)*5/9:u.toLowerCase()==='k'?n-273.15:n;if(c< -273.15)throw new Error('Temperature cannot be below absolute zero.');return textResult(`Celsius: ${c.toFixed(2)} °C\nFahrenheit: ${(c*9/5+32).toFixed(2)} °F\nKelvin: ${(c+273.15).toFixed(2)} K`)}
      const map=maps[id];if(!(u in map))throw new Error(`Unknown unit "${u}". Check the unit abbreviations in the example.`)
      const base=n*map[u];if(!Number.isFinite(base))throw new Error('Value is outside the supported conversion range.');return textResult(Object.entries(map).map(([k,f])=>`${k}: ${(base/f).toFixed(6)}`).join('\n'))
    }

    // QR / BARCODE
    case 'qr-generator':{if(input.length>5000)throw new Error('QR content is limited to 5,000 characters.');const data=await QRCode.toDataURL(input||'https://example.com',{width:640,margin:2});return blobResult(await downloadDataUrlBlob(data),'qr-code.png','image')}
    case 'barcode':{if(input.length>1000)throw new Error('Barcode content is limited to 1,000 characters.');const canvas=document.createElement('canvas');JsBarcode(canvas,input||'123456789012',{format:'CODE128',displayValue:true,margin:12});return blobResult(await canvasBlob(canvas),'barcode.png','image')}

    // SECURITY
    case 'password':{const raw=Number(input||16);if(!Number.isInteger(raw)||raw<8||raw>128)throw new Error('Password length must be a whole number from 8 to 128.');const groups=['ABCDEFGHJKLMNPQRSTUVWXYZ','abcdefghijkmnopqrstuvwxyz','23456789','!@#$%&*?'];const chars=groups.join('');const out=[...groups.map(group=>randomCharacters(group,1)),...randomCharacters(chars,raw-4)];for(let i=out.length-1;i>0;i--){const j=randomIntInclusive(0,i);[out[i],out[j]]=[out[j],out[i]]}return textResult(out.join(''))}
    case 'password-strength':{const score=[input.length>=12,/[a-z]/.test(input),/[A-Z]/.test(input),/\d/.test(input),/[^A-Za-z0-9]/.test(input)].filter(Boolean).length;return textResult(`${['Very weak','Weak','Fair','Good','Strong','Very strong'][score]}\nChecks passed: ${score}/5\nThis is a basic local estimate, not a security audit.`)}
    case 'text-encrypt':case 'text-decrypt':{
      const password=secondary;if(!password)throw new Error('Enter a password in the second field.');if(new TextEncoder().encode(password).byteLength>1024)throw new Error('Encryption passwords are limited to 1 KB.');if(input.length>10_000_000)throw new Error('Text encryption is limited to 10 MB of text.');if(id==='text-encrypt'&&new TextEncoder().encode(input).byteLength>10*1024*1024)throw new Error('UTF-8 text input is limited to 10 MB.');if(id==='text-decrypt'&&input.length>14_000_000)throw new Error('Encrypted payload exceeds the safe input limit.')
      const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey'])
      if(id==='text-encrypt'){const iterations=600000,salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),header=new Uint8Array(9);header.set([65,80,84,88,1]);new DataView(header.buffer).setUint32(5,iterations,false);const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt']);const data=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:header},key,new TextEncoder().encode(input)));return textResult(bytesToBase64(new Uint8Array([...header,...salt,...iv,...data])))}
      const raw=base64ToBytes(input);if(raw.length<29)throw new Error('Encrypted payload is invalid.')
      const magic=[65,80,84,88],isV2=raw.length>=37&&magic.every((v,i)=>raw[i]===v);let iterations=180000,salt:Uint8Array,iv:Uint8Array,data:Uint8Array,additionalData:Uint8Array|undefined
      if(isV2){if(raw[4]!==1)throw new Error('This encrypted payload version is not supported.');const header=raw.slice(0,9);iterations=new DataView(header.buffer,header.byteOffset,header.byteLength).getUint32(5,false);if(iterations<600000||iterations>1_000_000)throw new Error('Encrypted payload has unsafe key-derivation settings.');salt=raw.slice(9,25);iv=raw.slice(25,37);data=raw.slice(37);additionalData=header}else{salt=raw.slice(0,16);iv=raw.slice(16,28);data=raw.slice(28)}
      const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt'])
      return textResult(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData},key,data)))
    }
    case 'random-number':{const parts=input.trim()?input.split(',').map(Number):[1,100];if(parts.length!==2)throw new Error('Enter minimum and maximum separated by a comma, e.g. 1,100.');const [min,max]=parts;return textResult(String(randomIntInclusive(min,max)))}

    // UTILITIES
    case 'stopwatch':case 'countdown':case 'pomodoro':case 'notes':case 'todo':{
      return textResult('Use the interactive controls in this tool workspace. Your notes and task list are stored only in this browser.')
    }
    default:return processExtendedTool(id,input,secondary)
  }
}

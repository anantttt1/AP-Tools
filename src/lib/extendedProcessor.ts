import Papa from 'papaparse'

type Result = { kind: 'text'; value: string } | { kind: 'html'; value: string }
const text = (value: unknown): Result => ({ kind: 'text', value: String(value) })
const limit = (value: string, max = 2_000_000) => { if (value.length > max) throw new Error('Input is too large for safe browser processing.'); return value }
const words = (value: string) => value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []
const lines = (value: string) => value.replace(/\r\n?/g, '\n').split('\n')
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const bytesToBase64 = (bytes: Uint8Array) => { let binary = ''; for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(binary) }
const base64ToBytes = (input: string) => {
  const value = input.trim().replace(/\s/g, '')
  if (value.length > 5_500_000 || value.length % 4 === 1 || !/^[A-Za-z0-9+/_-]*={0,2}$/.test(value)) throw new Error('Invalid or oversized Base64URL input.')
  const normal = value.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '')
  const raw = atob(normal + '='.repeat((4 - normal.length % 4) % 4))
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}
const strictDate = (value: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!m) throw new Error('Enter a date as YYYY-MM-DD.')
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3])
  const dt = new Date(0)
  dt.setUTCHours(0, 0, 0, 0)
  dt.setUTCFullYear(y, mo - 1, d)
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) throw new Error('Enter a real calendar date as YYYY-MM-DD.')
  return dt
}
const splitCsv = (value: string, delimiter = ',') => { const parsed = Papa.parse<string[]>(value, { delimiter, skipEmptyLines: false }); if (parsed.errors.length) throw new Error(parsed.errors[0].message); return parsed.data }
const csvOutput = (rows: unknown[][], delimiter = ',') => Papa.unparse(rows, { delimiter })
const parseHex = (value: string) => {
  let s = value.trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(s)) s = s.split('').map(c => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(s)) throw new Error('Enter a 3- or 6-digit HEX colour such as #635BFF.')
  return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16))
}
const rgbHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase()
const luminance = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
const numberWords = (n: number): string => {
  if (!Number.isSafeInteger(n) || n < 0 || n > 999_999_999_999) throw new Error('Enter a whole number from 0 to 999,999,999,999.')
  const one = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
  const ten = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
  const under = (x: number): string => { const out: string[] = []; if (x >= 100) { out.push(one[Math.floor(x / 100)] + ' hundred'); x %= 100 } if (x >= 20) { out.push(ten[Math.floor(x / 10)] + (x % 10 ? '-' + one[x % 10] : '')); x = 0 } if (x > 0) out.push(one[x]); return out.join(' ') }
  if (n === 0) return 'zero'
  const units = ['', ' thousand', ' million', ' billion'], out: string[] = []
  let x = n, i = 0
  while (x > 0) { const chunk = x % 1000; if (chunk) out.unshift(under(chunk) + units[i]); x = Math.floor(x / 1000); i++ }
  return out.join(' ')
}
const romanMap: [string, number][] = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]]
const toRoman = (n: number) => { if (!Number.isInteger(n) || n < 1 || n > 3999) throw new Error('Enter a whole number from 1 to 3999.'); let x=n,out=''; for (const [symbol,value] of romanMap) while(x>=value){out+=symbol;x-=value}; return out }
const fromRoman = (value: string) => {
  const s=value.trim().toUpperCase()
  if(!s||!/^[IVXLCDM]+$/.test(s))throw new Error('Enter a valid Roman numeral.')
  let total=0
  for(let i=0;i<s.length;i++){const cur=romanMap.find(x=>x[0]===s[i])?.[1]||0,next=romanMap.find(x=>x[0]===s[i+1])?.[1]||0;total+=cur<next?-cur:cur}
  if(toRoman(total)!==s)throw new Error('This is not a canonical Roman numeral.')
  return total
}
const deepSort = (value: any): any => {
  if (Array.isArray(value)) return value.map(deepSort)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort((a,b)=>a.localeCompare(b)).map(key => [key, deepSort(value[key])]))
  return value
}
const parseClock = (value: string) => { const m=/^(\d{1,3}):([0-5]\d)(?::([0-5]\d))?$/.exec(value.trim()); if(!m)throw new Error('Enter time as HH:MM or HH:MM:SS.'); return Number(m[1])*3600+Number(m[2])*60+Number(m[3]||0) }
const spreadsheetSafeCell = (value: unknown) => {
  const cell = String(value ?? '')
  const trimmed = cell.replace(/^[\t\r ]+/, '')
  const formula = /^[=+@]/.test(trimmed) || /^-(?!\d+(?:\.\d+)?$)/.test(trimmed)
  return formula ? "'" + cell : cell
}
const mapSqlOutsideLiterals = (source: string, transform: (chunk: string) => string) => {
  let output = '', chunk = '', quote = ''
  const flush = () => { if (chunk) { output += transform(chunk); chunk = '' } }
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (quote) {
      output += char
      if (char === quote) {
        if (source[i + 1] === quote && quote !== ']') output += source[++i]
        else quote = ''
      } else if (char === '\\' && source[i + 1]) output += source[++i]
    } else if (char === "'" || char === '"' || char === '\x60') {
      flush(); quote = char; output += char
    } else if (char === '[') {
      flush(); quote = ']'; output += char
    } else chunk += char
  }
  flush()
  return output
}
const removeSqlComments = (source: string) => {
  let output = '', quote = '', i = 0
  while (i < source.length) {
    const char = source[i], next = source[i + 1]
    if (quote) {
      output += char; i++
      if (char === quote) {
        if (source[i] === quote && quote !== ']') output += source[i++]
        else quote = ''
      } else if (char === '\\' && i < source.length) output += source[i++]
      continue
    }
    if (char === "'" || char === '"' || char === '\x60') { quote = char; output += char; i++; continue }
    if (char === '[') { quote = ']'; output += char; i++; continue }
    if (char === '-' && next === '-') { i += 2; while (i < source.length && source[i] !== '\n') i++; continue }
    if (char === '/' && next === '*') { i += 2; const end = source.indexOf('*/', i); if (end < 0) throw new Error('SQL block comment is not closed.'); i = end + 2; continue }
    output += char; i++
  }
  return output
}
export async function processExtendedTool(id: string, rawInput: string, secondary: string): Promise<Result> {
  const input = limit(rawInput)
  switch (id) {
    case 'line-breaks-remove': return text(input.replace(/\s*\n+\s*/g,' ').replace(/[ \t]{2,}/g,' ').trim())
    case 'line-numbers-add': { const a=lines(input),pad=String(a.length).length; return text(a.map((line,i)=>String(i+1).padStart(pad,'0')+'. '+line).join('\n')) }
    case 'line-numbers-remove': return text(lines(input).map(line=>line.replace(/^\s*(?:(?:\d+)[.)\]:-]\s*|[-*]\s+)/,'')).join('\n'))
    case 'lines-prefix': return text(lines(input).map(line=>secondary+line).join('\n'))
    case 'lines-suffix': return text(lines(input).map(line=>line+secondary).join('\n'))
    case 'lines-reverse': return text(lines(input).reverse().join('\n'))
    case 'lines-shuffle': {
      const arr=lines(input)
      for(let i=arr.length-1;i>0;i--){const random=new Uint32Array(1),max=i+1,bound=Math.floor(0x1_0000_0000/max)*max;let n=0;do{crypto.getRandomValues(random);n=random[0]}while(n>=bound);const j=n%max;[arr[i],arr[j]]=[arr[j],arr[i]]}
      return text(arr.join('\n'))
    }
    case 'words-sort': return text(words(input).sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'})).join(' '))
    case 'word-frequency':
    case 'keyword-density': {
      const all=words(input).map(x=>x.toLocaleLowerCase()),freq=new Map<string,number>()
      all.forEach(w=>freq.set(w,(freq.get(w)||0)+1))
      const sorted=[...freq].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,100)
      if(id==='word-frequency')return text('Words: '+all.length+'\nUnique words: '+freq.size+'\n\n'+sorted.map(([w,n])=>w+': '+n).join('\n'))
      return text(sorted.map(([w,n])=>w+': '+n+' ('+(all.length?(100*n/all.length).toFixed(2):'0.00')+'%)').join('\n')||'No words found.')
    }
    case 'sentence-count': { const s=input.trim()?input.trim().split(/(?<=[.!?])\s+/).filter(Boolean):[];return text('Sentences: '+s.length+'\nWords: '+words(input).length+'\nAverage words per sentence: '+(s.length?(words(input).length/s.length).toFixed(1):'0')) }
    case 'paragraph-count': { const p=input.trim()?input.trim().split(/\n\s*\n/).filter(x=>x.trim()):[];return text('Paragraphs: '+p.length+'\n'+p.map((v,i)=>'Paragraph '+(i+1)+': '+words(v).length+' words').join('\n')) }
    case 'text-cleaner': return text(input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').replace(/\uFEFF/g,'').replace(/[ \t]+$/gm,'').trim())
    case 'whitespace-normalizer': return text(input.replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim())
    case 'title-case': return text(input.toLocaleLowerCase().replace(/(^|[\s([{])([\p{L}\p{N}])/gu,(_m,p,c)=>p+c.toLocaleUpperCase()))
    case 'sentence-case': return text(input.toLocaleLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu,c=>c.toLocaleUpperCase()))
    case 'camel-case':
    case 'pascal-case':
    case 'snake-case':
    case 'kebab-case':
    case 'constant-case': {
      const parts=input.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').match(/[\p{L}\p{N}]+/gu)||[],lower=parts.map(x=>x.toLocaleLowerCase()),camel=lower.map((x,i)=>i?x.charAt(0).toLocaleUpperCase()+x.slice(1):x).join('')
      if(id==='camel-case')return text(camel)
      if(id==='pascal-case')return text(lower.map(x=>x.charAt(0).toLocaleUpperCase()+x.slice(1)).join(''))
      if(id==='snake-case')return text(lower.join('_'))
      if(id==='kebab-case')return text(lower.join('-'))
      return text(lower.join('_').toUpperCase())
    }
    case 'alternating-case': { let i=0;return text([...input].map(c=>/[\p{L}]/u.test(c)?(i++%2?c.toLocaleUpperCase():c.toLocaleLowerCase()):c).join('')) }
    case 'remove-emojis': return text(input.replace(/[\p{Extended_Pictographic}\uFE0F]/gu,''))
    case 'non-ascii-remover': return text(input.replace(/[^\x09\x0A\x0D\x20-\x7E]/g,''))
    case 'extract-emails': return text([...new Set(input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[])].join('\n'))
    case 'extract-urls': return text([...new Set(input.match(/https?:\/\/[^\s<>"']+/gi)||[])].join('\n'))
    case 'extract-phone-numbers': return text([...new Set(input.match(/(?:\+?\d[\d().\s-]{6,}\d)/g)||[])].map(x=>x.trim()).join('\n'))

    case 'text-to-hex': return text([...new TextEncoder().encode(input)].map(x=>x.toString(16).padStart(2,'0')).join(' '))
    case 'hex-to-text': { const s=input.trim().replace(/[\s,:-]/g,'');if(s.length%2||!/^(?:[0-9a-f]{2})+$/i.test(s))throw new Error('Enter an even number of hexadecimal digits, e.g. 48 69.');return text(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(s.match(/.{2}/g)||[],x=>parseInt(x,16)))) }
    case 'text-to-decimal': return text([...input].map(c=>c.codePointAt(0)).join(' '))
    case 'decimal-to-text': { const v=input.trim().split(/[\s,]+/).filter(Boolean).map(Number);if(!v.length||v.length>100000||v.some(n=>!Number.isInteger(n)||n<0||n>0x10FFFF||(n>=0xD800&&n<=0xDFFF)))throw new Error('Enter 1–100,000 valid Unicode decimal code points.');return text(v.map(n=>String.fromCodePoint(n)).join('')) }
    case 'unicode-escape': return text([...input].map(c=>{const n=c.codePointAt(0)!;return n<=0x7F?c:'\\u{'+n.toString(16)+'}'}).join(''))
    case 'unicode-unescape': return text(input.replace(/\\u\{([0-9a-f]{1,6})\}/gi,(_m,h)=>{const n=parseInt(h,16);if(n>0x10FFFF||(n>=0xD800&&n<=0xDFFF))throw new Error('Invalid Unicode code point.');return String.fromCodePoint(n)}).replace(/\\u([0-9a-f]{4})/gi,(_m,h)=>String.fromCharCode(parseInt(h,16))))
    case 'html-unescape': return text(new DOMParser().parseFromString(input,'text/html').body.textContent||'')
    case 'html-strip-tags': { const doc=new DOMParser().parseFromString(input,'text/html');doc.querySelectorAll('script,style,noscript,template').forEach(n=>n.remove());return text((doc.body.textContent||'').replace(/\s+/g,' ').trim()) }
    case 'text-to-html': return {kind:'html',value:'<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'"><pre style="white-space:pre-wrap;overflow-wrap:anywhere;font:16px/1.6 system-ui;padding:24px">'+escapeHtml(input)+'</pre>'}
    case 'markdown-toc': { const h=[...input.matchAll(/^(#{1,6})\s+(.+)$/gm)].map(m=>({depth:m[1].length,label:m[2].trim(),slug:m[2].trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s+/g,'-')}));return text(h.map(x=>'  '.repeat(x.depth-1)+'- ['+x.label+'](#'+x.slug+')').join('\n')||'No Markdown headings found.') }
    case 'markdown-table': {
      const rows=splitCsv(input).filter(r=>r.length);if(rows.length<2)throw new Error('Enter CSV with a header row and at least one data row.')
      const width=Math.max(...rows.map(r=>r.length)),cells=rows.map(r=>Array.from({length:width},(_,i)=>String(r[i]??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ')))
      return text('| '+cells[0].join(' | ')+' |\n| '+cells[0].map(()=> '---').join(' | ')+' |\n'+cells.slice(1).map(r=>'| '+r.join(' | ')+' |').join('\n'))
    }
    case 'markdown-escape': return text(input.replace(/([\\\x60*_{}\[\]<>()#+.!|>-])/g,'\\$1'))
    case 'markdown-unescape': return text(input.replace(/\\([\\\x60*_{}\[\]<>()#+.!|>-])/g,'$1'))

    case 'json-stringify-text': return text(JSON.stringify(input))
    case 'json-parse-text': { const v=JSON.parse(input);if(typeof v!=='string')throw new Error('The JSON value must be a string literal.');return text(v) }
    case 'lines-to-json': return text(JSON.stringify(lines(input).filter((x,i,a)=>x.length||i<a.length-1),null,2))
    case 'json-to-lines': { const v=JSON.parse(input);if(!Array.isArray(v)||v.some(x=>x!==null&&typeof x==='object'))throw new Error('Enter a JSON array of scalar values.');return text(v.map(x=>x===null?'null':String(x)).join('\n')) }
    case 'csv-to-tsv': return text(csvOutput(splitCsv(input).map(row=>row.map(spreadsheetSafeCell)),'\t'))
    case 'tsv-to-csv': return text(csvOutput(splitCsv(input,'\t').map(row=>row.map(spreadsheetSafeCell)),','))
    case 'csv-to-markdown': { const rows=splitCsv(input);if(rows.length<2)throw new Error('Enter CSV with a header and at least one row.');const w=Math.max(...rows.map(r=>r.length)),p=rows.map(r=>Array.from({length:w},(_,i)=>String(r[i]||'').replace(/\|/g,'\\|').replace(/\n/g,' ')));return text('| '+p[0].join(' | ')+' |\n| '+p[0].map(()=> '---').join(' | ')+' |\n'+p.slice(1).map(r=>'| '+r.join(' | ')+' |').join('\n')) }
    case 'csv-to-html': { const rows=splitCsv(input);if(!rows.length)throw new Error('Enter CSV data.');const body=rows.map((r,i)=>'<tr>'+r.map(c=>(i===0?'<th>':'<td>')+escapeHtml(String(c))+(i===0?'</th>':'</td>')).join('')+'</tr>').join('');return {kind:'html',value:'<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'"><style>body{font:14px system-ui;padding:20px}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}</style><table>'+body+'</table>'} }
    case 'json-sort-keys': return text(JSON.stringify(deepSort(JSON.parse(input)),null,2))
    case 'json-flatten': {
      const v=JSON.parse(input),out:Record<string,unknown>={}
      const walk=(x:any,path:string)=>{if(x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length){for(const k of Object.keys(x)){if(['__proto__','constructor','prototype'].includes(k))throw new Error('Unsafe JSON property name.');walk(x[k],path?path+'.'+k:k)}}else out[path||'$']=x}
      walk(v,'');return text(JSON.stringify(out,null,2))
    }
    case 'json-unflatten': {
      const v=JSON.parse(input);if(!v||typeof v!=='object'||Array.isArray(v))throw new Error('Enter a flat JSON object.')
      const root:Record<string,any>={}
      for(const [path,value] of Object.entries(v)){const parts=path.split('.');if(parts.some(k=>!k||['__proto__','constructor','prototype'].includes(k)))throw new Error('Invalid or unsafe dotted key path: '+path);let cur=root;for(const part of parts.slice(0,-1))cur=cur[part] ||= {};cur[parts.at(-1)!]=value}
      return text(JSON.stringify(root,null,2))
    }
    case 'xml-formatter':
    case 'xml-minifier': {
      if(/<!DOCTYPE|<!ENTITY/i.test(input))throw new Error('Document type and entity declarations are not accepted.')
      const doc=new DOMParser().parseFromString(input,'application/xml');if(doc.querySelector('parsererror'))throw new Error('XML is not well-formed.')
      let xml=new XMLSerializer().serializeToString(doc)
      if(id==='xml-minifier')return text(xml.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').trim())
      xml=xml.replace(/>\s+</g,'><').trim();const tokens=xml.match(/<[^>]+>|[^<]+/g)||[],out:string[]=[];let depth=0
      for(const token of tokens){if(/^<\//.test(token))depth=Math.max(0,depth-1);out.push('  '.repeat(depth)+token.trim());if(/^<[^!?/][^>]*[^/]?>$/.test(token)&&! /\/>$/.test(token))depth++}
      return text(out.join('\n'))
    }
    case 'json-to-xml': {
      const v=JSON.parse(input),tag=(k:string)=>{const s=k.replace(/[^A-Za-z0-9_.-]/g,'_');return /^[A-Za-z_]/.test(s)?s:'_'+s}
      const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
      const build=(name:string,x:any):string=>{if(Array.isArray(x))return x.map(v=>build(name,v)).join('');if(x&&typeof x==='object')return '<'+name+'>'+Object.entries(x).map(([k,v])=>build(tag(k),v)).join('')+'</'+name+'>';return '<'+name+'>'+esc(x===null?'':String(x))+'</'+name+'>'}
      return text('<?xml version="1.0" encoding="UTF-8"?>'+build('root',v))
    }
    case 'xml-to-json': {
      if(/<!DOCTYPE|<!ENTITY/i.test(input))throw new Error('Document type and entity declarations are not accepted.')
      const doc=new DOMParser().parseFromString(input,'application/xml');if(doc.querySelector('parsererror')||!doc.documentElement)throw new Error('XML is not well-formed.')
      const convert=(node:Element):any=>{const out:Record<string,any>={};for(const a of [...node.attributes])out['@'+a.name]=a.value;for(const child of [...node.children]){const val=convert(child);if(Object.prototype.hasOwnProperty.call(out,child.tagName))out[child.tagName]=Array.isArray(out[child.tagName])?[...out[child.tagName],val]:[out[child.tagName],val];else out[child.tagName]=val};const plain=[...node.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent||'').join('').trim();if(plain)out['#text']=plain;return Object.keys(out).length?out:node.textContent||''}
      return text(JSON.stringify({[doc.documentElement.tagName]:convert(doc.documentElement)},null,2))
    }
    case 'css-formatter': return text(input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*{\s*/g,' {\n  ').replace(/\s*;\s*/g,';\n  ').replace(/\s*}\s*/g,'\n}\n').replace(/,\s*/g,',\n').replace(/[ \t]+/g,' ').trim())
    case 'css-minifier': return text(input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').replace(/\s+/g,' ').trim())
    case 'sql-formatter': { const re=/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|ON|VALUES|INSERT INTO|UPDATE|SET|DELETE FROM|CREATE TABLE|ALTER TABLE|UNION|AND|OR)\b/gi;const safe=mapSqlOutsideLiterals(input,chunk=>chunk.replace(/\s+/g,' ').replace(re,m=>'\n'+m.toUpperCase()));return text(safe.trim().replace(/,[ \t]*/g,',\n  ')) }
    case 'sql-minifier': return text(removeSqlComments(input).replace(/\s+/g,' ').trim())
    case 'sql-escape': return text("'"+input.replace(/\u0000/g,'').replace(/'/g,"''")+"'")
    case 'url-parser': { let u:URL;try{u=new URL(input.trim())}catch{throw new Error('Enter a complete URL including https:// or http://.')};return text(['Href: '+u.href,'Protocol: '+u.protocol,'Username: '+(u.username||'—'),'Hostname: '+u.hostname,'Port: '+(u.port||'—'),'Pathname: '+u.pathname,'Query: '+(u.search||'—'),'Hash: '+(u.hash||'—')].join('\n')) }
    case 'query-string-parser': { let q=input.trim().replace(/^\?/,'');if(/^https?:\/\//i.test(q)){try{q=new URL(q).search.replace(/^\?/,'')}catch{throw new Error('Enter a valid URL or query string.')}};const out:Record<string,string[]>={};new URLSearchParams(q).forEach((v,k)=>(out[k] ||= []).push(v));return text(JSON.stringify(Object.fromEntries(Object.entries(out).map(([k,v])=>[k,v.length===1?v[0]:v])),null,2)) }
    case 'query-string-builder': { const v=JSON.parse(input);if(!v||typeof v!=='object'||Array.isArray(v))throw new Error('Enter a JSON object of query parameters.');const p=new URLSearchParams();for(const [k,x] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw new Error('Unsafe property name.');if(Array.isArray(x))x.forEach(y=>p.append(k,String(y)));else if(x!==null&&x!==undefined)p.append(k,String(x))};return text(p.toString()) }
    case 'base64url-encoder': return text(bytesToBase64(new TextEncoder().encode(input)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''))
    case 'base64url-decoder': return text(new TextDecoder('utf-8',{fatal:true}).decode(base64ToBytes(input)))
    case 'hmac-sha256': { if(!secondary)throw new Error('Enter the HMAC secret key in the Additional input field.');if(secondary.length>4096)throw new Error('HMAC key is limited to 4,096 characters.');const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secondary),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(input));return text([...new Uint8Array(sig)].map(v=>v.toString(16).padStart(2,'0')).join('')) }

    case 'uuid-validator': return text(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.trim())?'Valid UUID format.':'Invalid UUID format.')
    case 'email-validator': return text(/^[A-Z0-9.!#$%&'*+/=?^_\x60{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(input.trim())?'Email syntax looks valid. Mailbox existence is not checked.':'Invalid email syntax.')
    case 'url-validator': { try{const u=new URL(input.trim());return text(['http:','https:'].includes(u.protocol)&&!!u.hostname?'Valid HTTP/HTTPS URL.':'Enter an HTTP or HTTPS URL.')}catch{return text('Invalid URL.')} }
    case 'ipv4-validator': { const p=input.trim().split('.'),valid=p.length===4&&p.every(x=>/^\d{1,3}$/.test(x)&&Number(x)>=0&&Number(x)<=255&&(x==='0'||!x.startsWith('0')));return text(valid?'Valid IPv4 dotted-decimal address.':'Invalid IPv4 address.') }
    case 'mac-validator': return text(/^(?:[0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.test(input.trim())?'Valid MAC address format.':'Invalid MAC address format.')
    case 'hex-color-validator': return text(/^#?(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(input.trim())?'Valid HEX colour notation.':'Invalid HEX colour. Use 3, 6 or 8 hexadecimal digits.')
    case 'credit-card-validator': { const s=input.replace(/[\s-]/g,'');if(!/^\d{12,19}$/.test(s))return text('Invalid card-number format. Enter 12–19 digits.');let sum=0,double=false;for(let i=s.length-1;i>=0;i--){let n=Number(s[i]);if(double){n*=2;if(n>9)n-=9};sum+=n;double=!double};return text(sum%10===0?'Luhn checksum passed. This does not confirm the card is real, active or authorised.':'Luhn checksum failed.') }
    case 'isbn-validator': { const s=input.replace(/[\s-]/g,'').toUpperCase();if(/^\d{9}[\dX]$/.test(s)){const total=[...s].reduce((sum,c,i)=>sum+(c==='X'?10:Number(c))*(10-i),0);return text(total%11===0?'Valid ISBN-10 checksum.':'Invalid ISBN-10 checksum.')};if(/^\d{13}$/.test(s)){const total=[...s.slice(0,12)].reduce((sum,c,i)=>sum+Number(c)*(i%2?3:1),0);return text((10-total%10)%10===Number(s[12])?'Valid ISBN-13 checksum.':'Invalid ISBN-13 checksum.')};return text('Enter an ISBN-10 or ISBN-13 value.') }

    case 'color-contrast-checker': { const v=input.split(',');if(v.length!==2)throw new Error('Enter foreground and background HEX colours separated by a comma.');const a=parseHex(v[0]),b=parseHex(v[1]),la=a.map(luminance).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0),lb=b.map(luminance).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0),ratio=(Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);return text('Contrast ratio: '+ratio.toFixed(2)+':1\nWCAG AA normal text (4.5:1): '+(ratio>=4.5?'Pass':'Fail')+'\nWCAG AA large text (3:1): '+(ratio>=3?'Pass':'Fail')+'\nWCAG AAA normal text (7:1): '+(ratio>=7?'Pass':'Fail')) }
    case 'color-shade-generator': { const rgb=parseHex(input);return text([-80,-60,-40,-20,0,20,40,60,80].map(d=>{const t=d<0?0:255,a=Math.abs(d)/100,s=rgb.map(v=>v+(t-v)*a);return(d>0?'+':'')+d+'%  '+rgbHex(s[0],s[1],s[2])}).join('\n')) }
    case 'rgb-to-hex': { const v=input.split(/[,\s]+/).map(Number);if(v.length!==3||v.some(x=>!Number.isInteger(x)||x<0||x>255))throw new Error('Enter RGB values from 0–255, e.g. 99,91,255.');return text(rgbHex(v[0],v[1],v[2])) }
    case 'hex-to-rgb': { const [r,g,b]=parseHex(input),rn=r/255,gn=g/255,bn=b/255,max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn),d=max-min;let h=0,s=0,l=(max+min)/2;if(d){s=d/(1-Math.abs(2*l-1));if(max===rn)h=60*(((gn-bn)/d)%6);else if(max===gn)h=60*((bn-rn)/d+2);else h=60*((rn-gn)/d+4)};return text('HEX: '+rgbHex(r,g,b)+'\nRGB: '+r+', '+g+', '+b+'\nHSL: '+Math.round((h+360)%360)+'°, '+Math.round(s*100)+'%, '+Math.round(l*100)+'%') }
    case 'px-to-rem':
    case 'rem-to-px': { const [v0,base0]=input.split(',').map(x=>x.trim()),v=Number(v0),base=base0===undefined?16:Number(base0);if(!Number.isFinite(v)||!Number.isFinite(base)||base<=0||base>256)throw new Error('Enter value,root-size (for example 24,16); root size must be 0–256.');const out=id==='px-to-rem'?v/base:v*base;return text(out.toFixed(4).replace(/0+$/,'').replace(/\.$/,'')+(id==='px-to-rem'?'rem':'px')) }

    case 'aspect-ratio-calculator': { const [w,h]=input.split(',').map(Number);if(![w,h].every(Number.isSafeInteger)||w<=0||h<=0)throw new Error('Enter positive whole-number width,height values such as 1920,1080.');const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a,r=gcd(w,h);return text('Ratio: '+w/r+':'+h/r+'\nDecimal: '+(w/h).toFixed(6)+'\n16:9 match: '+(Math.abs(w/h-16/9)<.01?'Yes':'No')) }
    case 'binary-to-decimal': { const s=input.trim().replace(/[\s_]/g,'');if(!/^[01]{1,256}$/.test(s))throw new Error('Enter 1–256 binary digits.');return text(BigInt('0b'+s).toString(10)) }
    case 'decimal-to-binary': { const s=input.trim();if(!/^-?\d{1,256}$/.test(s))throw new Error('Enter a whole decimal integer.');return text(BigInt(s).toString(2)) }
    case 'decimal-to-hex': { const s=input.trim();if(!/^-?\d{1,256}$/.test(s))throw new Error('Enter a whole decimal integer.');return text(BigInt(s).toString(16).toUpperCase()) }
    case 'hex-to-decimal': { const s=input.trim().replace(/^0x/i,'');if(!/^[0-9a-f]{1,256}$/i.test(s))throw new Error('Enter a valid hexadecimal integer.');return text(BigInt('0x'+s).toString(10)) }
    case 'decimal-to-octal': { const s=input.trim();if(!/^-?\d{1,256}$/.test(s))throw new Error('Enter a whole decimal integer.');return text(BigInt(s).toString(8)) }
    case 'roman-to-decimal': return text(String(fromRoman(input)))
    case 'decimal-to-roman': return text(toRoman(Number(input.trim())))
    case 'number-to-words': return text(numberWords(Number(input.trim())))
    case 'prime-checker': { const n=Number(input.trim());if(!Number.isSafeInteger(n)||n<0||n>1_000_000_000)throw new Error('Enter a whole number from 0 to 1,000,000,000.');if(n<2)return text(n+' is not prime.');for(let d=2;d<=Math.sqrt(n);d++)if(n%d===0)return text(n+' is not prime; it is divisible by '+d+'.');return text(n+' is prime.') }
    case 'prime-generator': { const n=Number(input.trim());if(!Number.isInteger(n)||n<2||n>1_000_000)throw new Error('Enter an upper limit from 2 to 1,000,000.');const sieve=new Uint8Array(n+1);for(let p=2;p*p<=n;p++)if(!sieve[p])for(let j=p*p;j<=n;j+=p)sieve[j]=1;const out:number[]=[];for(let p=2;p<=n;p++)if(!sieve[p])out.push(p);return text(out.join(', ')) }
    case 'factorial-calculator': { const n=Number(input.trim());if(!Number.isInteger(n)||n<0||n>170)throw new Error('Enter an integer from 0 to 170.');let v=1;for(let i=2;i<=n;i++)v*=i;return text(String(v)) }
    case 'fibonacci-generator': { const n=Number(input.trim());if(!Number.isInteger(n)||n<1||n>1000)throw new Error('Enter a term count from 1 to 1,000.');const a:bigint[]=[0n];if(n>1)a.push(1n);for(let i=2;i<n;i++)a.push(a[i-1]+a[i-2]);return text(a.map(String).join(', ')) }
    case 'gcd-lcm-calculator': { const v=input.split(',').map(Number);if(v.length!==2||v.some(x=>!Number.isSafeInteger(x)))throw new Error('Enter two whole numbers separated by a comma.');const [a,b]=v,gcd=(x:number,y:number):number=>y?gcd(y,x%y):Math.abs(x),g=gcd(a,b),l=g===0?0:Math.abs(a/g*b);if(!Number.isSafeInteger(l))throw new Error('LCM exceeds the safe integer range.');return text('GCD: '+g+'\nLCM: '+l) }
    case 'percentage-change': { const v=input.split(',').map(Number);if(v.length!==2||!v.every(Number.isFinite)||v[0]===0)throw new Error('Enter original,new values; original must not be zero.');const p=(v[1]-v[0])/Math.abs(v[0])*100;return text('Change: '+p.toFixed(2)+'%\n'+(p>0?'Increase':p<0?'Decrease':'No change')) }
    case 'tip-calculator': { const v=input.split(',').map(Number),bill=v[0],rate=v[1],people=v[2]===undefined?1:v[2];if(v.length<2||v.length>3||![bill,rate,people].every(Number.isFinite)||bill<0||rate<0||rate>100||!Number.isInteger(people)||people<1||people>1000)throw new Error('Enter bill,tip-percent,people (for example 1200,10,3).');const tip=bill*rate/100,total=bill+tip;return text('Tip: '+tip.toFixed(2)+'\nTotal: '+total.toFixed(2)+'\nPer person: '+(total/people).toFixed(2)) }
    case 'date-add-days': { const v=input.split(','),date=strictDate(v[0]||''),days=Number(v[1]);if(v.length!==2||!Number.isSafeInteger(days)||Math.abs(days)>1_000_000)throw new Error('Enter date,days (for example 2026-01-01,30).');date.setUTCDate(date.getUTCDate()+days);return text(date.toISOString().slice(0,10)) }
    case 'working-days-calculator': { const v=input.split(',');if(v.length!==2)throw new Error('Enter start and end dates as YYYY-MM-DD,YYYY-MM-DD.');const a=strictDate(v[0]),b=strictDate(v[1]);let d=new Date(Math.min(a.getTime(),b.getTime())),end=Math.max(a.getTime(),b.getTime()),count=0;if(end-d.getTime()>36525*86400000)throw new Error('Date range is limited to 100 years.');while(d.getTime()<=end){if(d.getUTCDay()!==0&&d.getUTCDay()!==6)count++;d.setUTCDate(d.getUTCDate()+1)};return text('Weekdays (inclusive): '+count+'\nWeekends excluded: yes\nPublic holidays excluded: no') }
    case 'time-duration-calculator': { const v=input.split(',');if(v.length!==2)throw new Error('Enter two clock times or durations separated by a comma.');let a=parseClock(v[0]),b=parseClock(v[1]);if(v.every(x=>x.trim().split(':').length===2)&&b<a)b+=86400;const d=Math.abs(b-a),h=Math.floor(d/3600),m=Math.floor(d%3600/60),s=d%60;return text('Duration: '+h+' hours, '+m+' minutes, '+s+' seconds\nTotal minutes: '+(d/60).toFixed(2)+'\nTotal seconds: '+d) }
    case 'reading-time-estimator': { const n=words(input).length,pace=Number(secondary||200);if(!Number.isFinite(pace)||pace<50||pace>1000)throw new Error('Reading pace must be 50–1,000 words per minute.');const mins=n/pace;return text('Words: '+n+'\nReading speed: '+pace+' words/minute\nEstimated reading time: '+(mins<1?Math.max(1,Math.ceil(mins*60))+' seconds':Math.ceil(mins)+' minute(s)')) }
    default: throw new Error('This additional tool is not registered.')
  }
}

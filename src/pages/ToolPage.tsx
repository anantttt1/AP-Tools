
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { Download, Heart, RotateCcw, ShieldCheck, AlertCircle, Copy, FileUp, Clock3, Play, Pause, Square, Plus, Trash2 } from 'lucide-react'
import { tools } from '../data/tools'
import { useAppStore } from '../store/useAppStore'
import { processTool, type ProcessResult } from '../lib/processor'

const fileToolIds = new Set([
  'zip-creator','zip-extractor','file-type','file-size','file-hash','file-compare','bulk-rename',
  'pdf-merge','pdf-split','pdf-images','images-pdf','pdf-text','pdf-watermark','pdf-rotate','pdf-info','pdf-page-numbers','pdf-inspector',
  'image-compress','image-resize','image-crop','image-convert','image-rotate','image-flip','image-grayscale','image-watermark','image-base64','image-metadata','image-color','favicon','image-collage','image-pdf'
])
const multipleIds = new Set(['zip-creator','file-compare','bulk-rename','pdf-merge','images-pdf','image-pdf','image-collage'])
const help: Record<string,string> = {
  'pdf-split':'Upload a PDF. Enter page numbers separated by commas, e.g. 1,3,5. Leave blank to copy all pages.',
  'image-crop':'Enter crop rectangle as x,y,width,height in source-image pixels, e.g. 0,0,800,600.',
  'image-color':'Enter pixel coordinates as x,y, e.g. 10,10.',
  'emi':'Enter principal, annual interest rate (%), term in months, e.g. 500000,9,60.',
  'simple-interest':'Enter principal, annual rate (%), time in years, e.g. 10000,5,2.',
  'compound-interest':'Enter principal, annual rate (%), years, e.g. 10000,5,2.',
  'date-difference':'Enter two dates separated by a comma, e.g. 2026-01-01,2026-12-31.',
  'bmi':'Enter weight in kilograms and height in centimetres, e.g. 70,175.',
  'ratio':'Enter a ratio like 12:18.',
  'unit-length':'Enter value and unit, e.g. 5,km. Units: mm, cm, m, km, in, ft, yd, mi.',
  'unit-weight':'Enter value and unit, e.g. 70,kg. Units: mg, g, kg, tonne, lb, oz.',
  'unit-temp':'Enter value and unit C/F/K, e.g. 100,C.',
  'unit-data':'Enter value and unit, e.g. 5,GB. Units: B, KB, MB, GB, TB, KiB, MiB, GiB.',
  'unit-speed':'Enter value and unit, e.g. 100,km/h. Units: m/s, km/h, mph, knot.',
  'random-number':'Enter minimum and maximum separated by comma, e.g. 1,100.',
  'percentage':'Enter the base amount. Enter the percentage in the second field.',
  'gst':'Enter amount. Enter GST rate in the second field.',
  'discount':'Enter original price. Enter discount percentage in the second field.',
  'text-encrypt':'Enter text. Enter encryption password in the second field. Keep both safe.',
  'text-decrypt':'Paste AP TOOLS encrypted Base64 text. Enter password in the second field.',
  'regex':'Enter text to test. Enter regular expression in the second field.',
  'timestamp':'Enter Unix timestamp in seconds or milliseconds.',
  'password':'Enter desired password length (8–128).',
  'uuid':'Enter number of UUIDs to generate (1–100).',
  'random-string':'Enter optional allowed characters. Set output length in the second field.',
  'lorem':'Enter the number of placeholder paragraphs (1–30).',
  'pdf-watermark':'Upload a PDF. Enter watermark text below.',
  'pdf-rotate':'Upload a PDF. Enter rotation: 90, 180 or 270 degrees.',
  'image-watermark':'Upload an image. Enter watermark text in the second field.',
  'image-resize':'Upload an image and set maximum width/height.',
  'image-compress':'Upload an image and choose output quality and format.',
  'image-convert':'Upload an image and choose output format.',
  'image-rotate':'Upload an image. Enter rotation in the second field: 90, 180 or 270.',
  'file-compare':'Choose two text files.',
  'bulk-rename':'Choose files. Files are not renamed in place; a ZIP with renamed copies is created.',
  'images-pdf':'Choose JPG or PNG images. Each image becomes one PDF page.',
  'image-collage':'Choose two or more images to create a simple grid collage.',
  'pdf-inspector':'Inspect page count, dimensions and metadata for the selected PDF.'
}
const textPlaceholders: Record<string,string> = {
  'word-counter':'Paste or type text here...','case-converter':'Enter text to convert...','remove-spaces':'Paste text...','duplicate-lines':'Enter lines...','sort-lines':'Enter lines...','reverse-text':'Enter text...','text-diff':'Enter the first text block...','slug-generator':'Enter a title or phrase...','lorem':'3','markdown-preview':'# Hello AP TOOLS\n\nWrite **Markdown** here...','text-binary':'Enter text...','binary-text':'01001000 01101001','text-morse':'Hello world','morse-text':'.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
  'json-format':'{"name":"AP TOOLS","free":true}','json-minify':'Paste JSON...','json-csv':'[{"name":"AP TOOLS","category":"Utility"}]','csv-json':'name,category\nAP TOOLS,Utility','xml-escape':'Enter HTML/XML text...','base64-encode':'Enter text...','base64-decode':'Paste Base64...','url-encode':'Enter URL or text...','url-decode':'Enter encoded URL...','jwt-decode':'Paste JWT token...','uuid':'1','regex':'Enter test text...','timestamp':'1735689600','html-minify':'Paste HTML...','css-gradient':'#635BFF','css-shadow':'0 4px 16px rgba(0,0,0,.12)','color-convert':'#635BFF','random-string':'Leave blank for default character set','hash-text':'Enter text to hash...','regex-escape':'Enter text to escape...','markdown-html':'# Hello\n\nMarkdown to HTML','html-preview':'<h1>Hello AP TOOLS</h1><p>Preview your HTML here.</p>',
  'calculator':'(25 + 5) * 2','percentage':'1000','gst':'1000','discount':'1000','emi':'500000,9,60','simple-interest':'10000,5,2','compound-interest':'10000,5,2','age':'2000-01-01','date-difference':'2026-01-01,2026-12-31','bmi':'70,175','average':'10,20,30,40','ratio':'12:18','unit-length':'5,km','unit-weight':'70,kg','unit-temp':'100,C','unit-data':'5,GB','unit-speed':'100,km/h','qr-generator':'https://example.com','barcode':'123456789012','password':'16','password-strength':'Enter password to check','text-encrypt':'Text to encrypt...','text-decrypt':'Encrypted Base64 payload...','random-number':'1,100'
}
function UtilityWidget({id}:{id:string}) {
  const [seconds,setSeconds]=useState(0)
  const [running,setRunning]=useState(false)
  const [target,setTarget]=useState(25*60)
  const [breakMinutes,setBreakMinutes]=useState(5)
  const [phase,setPhase]=useState<'work'|'break'>('work')
  const [note,setNote]=useState(()=>{try{return localStorage.getItem('ap-tools-note')||''}catch{return ''}})
  const [task,setTask]=useState('')
  const [tasks,setTasks]=useState<string[]>(()=>{try{const v=JSON.parse(localStorage.getItem('ap-tools-tasks')||'[]');return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string').map(x=>x.slice(0,300)).slice(0,500):[]}catch{return []}})
  useEffect(()=>{setRunning(false);setSeconds(0);setTarget(25*60);setBreakMinutes(5);setPhase('work')},[id])
  useEffect(()=>{
    if(!running)return
    const timer=window.setInterval(()=>setSeconds(value=>value+1),1000)
    return()=>clearInterval(timer)
  },[running])
  useEffect(()=>{
    if(!running||id==='stopwatch')return
    const limit=id==='pomodoro'&&phase==='break'?breakMinutes*60:target
    if(seconds>=limit){
      if(id==='pomodoro'&&phase==='work'){
        setPhase('break')
        setSeconds(0)
      }else{
        setRunning(false)
        if(id==='pomodoro'){setPhase('work');setSeconds(0)}
      }
    }
  },[seconds,running,id,phase,target,breakMinutes])
  useEffect(()=>{try{if(id==='notes')localStorage.setItem('ap-tools-note',note)}catch{/* Browser storage may be disabled or full. */}},[note,id])
  useEffect(()=>{try{if(id==='todo')localStorage.setItem('ap-tools-tasks',JSON.stringify(tasks))}catch{/* Browser storage may be disabled or full. */}},[tasks,id])
  const time=(n:number)=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`
  const addTask=()=>{const value=task.trim();if(value&&value.length<=300&&tasks.length<500){setTasks(v=>v.length>=500?v:[...v,value]);setTask('')}}
  if(id==='notes')return <div className="utility-widget"><label className="field-label">Your private note<textarea rows={10} maxLength={50000} value={note} onChange={e=>setNote(e.target.value)} placeholder="Write notes. Saved in this browser only."/></label><span className="subtle-hint">Autosaved locally · {note.length} characters</span></div>
  if(id==='todo')return <div className="utility-widget"><div className="todo-add"><input maxLength={300} value={task} onChange={e=>setTask(e.target.value)} placeholder="Add a task..." onKeyDown={e=>{if(e.key==='Enter')addTask()}}/><button className="button-primary" onClick={addTask}><Plus size={15}/> Add</button></div>{tasks.map((t,i)=><div className="todo-row" key={`${t}-${i}`}><span>{t}</span><button className="icon-button" onClick={()=>setTasks(v=>v.filter((_,j)=>j!==i))} aria-label={`Delete ${t}`}><Trash2 size={15}/></button></div>)}{!tasks.length&&<span className="subtle-hint">Your task list is empty.</span>}</div>
  const isCountdown=id==='countdown'||id==='pomodoro'
  const duration=id==='pomodoro'&&phase==='break'?breakMinutes*60:target
  const display=isCountdown?Math.max(0,duration-seconds):seconds
  return <div className="utility-widget timer-widget"><div className="timer-face"><Clock3 size={22}/><strong>{time(display)}</strong><span>{id==='pomodoro'?(phase==='work'?'Focus session':'Short break'):id==='countdown'?'Countdown':'Stopwatch'}</span></div>
    {id==='countdown'&&<label className="field-label timer-setting">Duration (minutes)<input type="number" min="1" max="240" value={Math.round(target/60)} onChange={e=>{const mins=Math.min(240,Math.max(1,Number(e.target.value)||1));setTarget(mins*60);setSeconds(0);setRunning(false)}}/></label>}
    {id==='pomodoro'&&<div className="settings-grid timer-setting"><label>Focus duration (minutes)<input type="number" min="1" max="240" value={Math.round(target/60)} onChange={e=>{setTarget(Math.min(240,Math.max(1,Number(e.target.value)||1))*60);setSeconds(0);setPhase('work');setRunning(false)}}/></label><label>Break duration (minutes)<input type="number" min="1" max="60" value={breakMinutes} onChange={e=>{setBreakMinutes(Math.min(60,Math.max(1,Number(e.target.value)||1)));setSeconds(0);setPhase('work');setRunning(false)}}/></label></div>}
    <div className="workspace-actions"><button className="button-primary" onClick={()=>{if(!running&&isCountdown&&seconds>=duration)setSeconds(0);setRunning(v=>!v)}}>{running?<Pause size={15}/>:<Play size={15}/>} {running?'Pause':'Start'}</button><button className="button-secondary" onClick={()=>{setRunning(false);setSeconds(0);setPhase('work')}}><Square size={14}/> Reset</button></div>
  </div>
}
export default function ToolPage() {
  const {id=''}=useParams()
  const tool=tools.find(t=>t.id===id)
  const addRecent=useAppStore(s=>s.addRecent)
  const favorites=useAppStore(s=>s.favorites)
  const toggleFavorite=useAppStore(s=>s.toggleFavorite)
  const [files,setFiles]=useState<File[]>([])
  const [input,setInput]=useState('')
  const [secondary,setSecondary]=useState('')
  const [output,setOutput]=useState<ProcessResult|null>(null)
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)
  const [quality,setQuality]=useState(80)
  const [width,setWidth]=useState(1200)
  const [height,setHeight]=useState(1200)
  const [format,setFormat]=useState('image/webp')
  const [prefix,setPrefix]=useState('file')
  const [start,setStart]=useState(1)
  const [flags,setFlags]=useState('g')
  const [previewUrl,setPreviewUrl]=useState('')
  const requestId=useRef(0)
  useEffect(()=>{if(output?.kind!=='blob'){setPreviewUrl('');return}const url=URL.createObjectURL(output.blob);setPreviewUrl(url);return()=>URL.revokeObjectURL(url)},[output])
  useEffect(()=>{requestId.current+=1;if(tool)addRecent(tool.id);setFiles([]);setInput('');setSecondary(id==='case-converter'?'upper':id==='image-flip'?'horizontal':'');setOutput(null);setError('');setBusy(false);setQuality(80);setWidth(1200);setHeight(1200);setFormat('image/webp');setPrefix('file');setStart(1);setFlags('g')},[tool,id,addRecent])
  
  if(!tool)return <div className="empty-state"><strong>Tool not found</strong><Link to="/tools">Back to tools</Link></div>
  const needsFiles=fileToolIds.has(id)
  const special=['stopwatch','countdown','pomodoro','notes','todo'].includes(id)
  const chooseToolFiles=(list:File[])=>{
    if(!multipleIds.has(id)&&list.length>1){setError('This tool accepts one file at a time. The first selected file is kept.');setFiles(list.slice(0,1));return}
    const maxCount:number=['images-pdf','image-pdf','image-collage'].includes(id)?50:id==='file-compare'?2:250
    if(list.length>maxCount){setError(`Choose no more than ${maxCount} file${maxCount===1?'':'s'} for this tool.`);return}
    const maxBytes=id==='file-compare'?20*1024*1024:id==='zip-extractor'?60*1024*1024:80*1024*1024
    if(list.reduce((sum,file)=>sum+file.size,0)>maxBytes){setError(`Selected files exceed this tool's ${Math.round(maxBytes/1024/1024)} MB input limit.`);return}
    setFiles(list);setError('')
  }
  const run=async()=>{
    const currentRequest=++requestId.current
    setBusy(true);setError('');setOutput(null)
    try{
      const result=await processTool(id,files,input,secondary,{quality,width,height,format,prefix,start,flags})
      if(currentRequest===requestId.current)setOutput(result)
    }catch(e){if(currentRequest===requestId.current)setError(e instanceof Error?e.message:'Processing failed. Please try again.')}
    finally{if(currentRequest===requestId.current)setBusy(false)}
  }
  const favorite=favorites.includes(id)
  const download=()=>{
    if(output?.kind!=='blob')return
    const url=URL.createObjectURL(output.blob)
    const a=document.createElement('a');a.href=url;a.download=output.filename;a.click()
    window.setTimeout(()=>URL.revokeObjectURL(url),1000)
  }
  return <motion.div className="page-stack" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
    <div className="breadcrumbs"><Link to="/tools">All tools</Link><span>/</span><span>{tool.category}</span><span>/</span><strong>{tool.name}</strong></div>
    <div className="tool-page-heading"><div><div className="eyebrow">{tool.category.toUpperCase()} TOOL</div><h1>{tool.name}</h1><p>{tool.description}</p></div><button className={`favorite-large ${favorite?'selected':''}`} onClick={()=>toggleFavorite(id)}><Heart size={16} fill={favorite?'currentColor':'none'}/>{favorite?'Saved':'Add to favorites'}</button></div>
    <div className="workspace-card">
      <div className="workspace-top"><div><strong>Tool workspace</strong><p>Runs locally in your browser. Files are not sent to an AP TOOLS server.</p></div><span className="local-badge"><span/> Local processing</span></div>
      {special?<UtilityWidget id={id}/>:<>
        {needsFiles&&<div className="upload-zone" onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add('dragging')}} onDragLeave={e=>e.currentTarget.classList.remove('dragging')} onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove('dragging');chooseToolFiles(Array.from(e.dataTransfer.files))}}>
          <input id="tool-file-input" type="file" multiple={multipleIds.has(id)} accept={id==='images-pdf'||id==='image-pdf'?'.jpg,.jpeg,.png,image/jpeg,image/png':id.includes('pdf')?'.pdf,application/pdf':id.includes('image')||id.includes('favicon')||id.includes('collage')?'image/*':undefined} onChange={e=>{chooseToolFiles(Array.from(e.target.files||[]));e.currentTarget.value=''}}/>
          <label htmlFor="tool-file-input"><FileUp size={28}/><strong>Drop files here or browse</strong><span>{multipleIds.has(id)?'Select multiple files if needed.':'Select a file from your device.'}</span></label>
          {files.length>0&&<div className="selected-files">{files.map((f,i)=><div key={`${f.name}-${i}`}>{f.name}<span>{(f.size/1024).toFixed(1)} KB</span></div>)}</div>}
        </div>}
        {id==='image-compress'||id==='image-resize'||id==='image-convert'||id==='favicon'?<div className="settings-grid">
          {(id==='image-resize'||id==='image-compress')&&<label>Max width (px)<input type="number" min="1" max="12000" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label>}
          {id==='image-resize'&&<label>Max height (px)<input type="number" min="1" max="12000" value={height} onChange={e=>setHeight(Number(e.target.value))}/></label>}
          <label>Quality · {quality}%<input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></label>
          <label>Output format<select value={format} onChange={e=>setFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label>
        </div>:null}
        {id==='bulk-rename'&&<div className="settings-grid"><label>Filename prefix<input value={prefix} onChange={e=>setPrefix(e.target.value)}/></label><label>Starting number<input type="number" value={start} onChange={e=>setStart(Number(e.target.value))}/></label></div>}
        {id==='image-flip'&&<label className="field-label">Flip direction<select value={secondary} onChange={e=>setSecondary(e.target.value)}><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></label>}
        {id==='case-converter'&&<label className="field-label">Conversion<select value={secondary} onChange={e=>setSecondary(e.target.value)}><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option></select></label>}
        {['percentage','gst','discount','regex','text-diff','text-encrypt','text-decrypt','css-gradient','image-rotate','random-string'].includes(id)&&(id==='text-diff'?<label className="field-label">Second text block<textarea maxLength={10_000_000} value={secondary} onChange={e=>setSecondary(e.target.value)} rows={6} placeholder="Enter the second text block to compare..."/></label>:<label className="field-label">Additional input<input maxLength={id==='text-encrypt'||id==='text-decrypt'?1024:id==='regex'?500:id==='random-string'?3:100} type={id==='text-encrypt'||id==='text-decrypt'?'password':'text'} autoComplete={id==='text-encrypt'||id==='text-decrypt'?'new-password':'off'} value={secondary} onChange={e=>setSecondary(e.target.value)} placeholder={id==='text-encrypt'||id==='text-decrypt'?'Password':id==='regex'?'Regular expression':id==='image-rotate'?'90, 180 or 270':id==='random-string'?'Output length (1–256)':'Enter required value'}/></label>)}
        {id==='regex'&&<label className="field-label">Regex flags<input maxLength={7} value={flags} onChange={e=>setFlags(e.target.value)} placeholder="g"/></label>}
        {id==='regex'&&<label className="field-label">Text to test<textarea maxLength={200_000} value={input} onChange={e=>setInput(e.target.value)} rows={5} placeholder="Text to test against regex..."/></label>}
        {!['regex'].includes(id)&&!needsFiles&&<label className="field-label">Input<textarea maxLength={10_000_000} value={input} onChange={e=>setInput(e.target.value)} rows={6} placeholder={textPlaceholders[id]||'Enter text or value...'}/></label>}
        {needsFiles&&['pdf-split','image-crop','image-color','pdf-watermark','pdf-rotate','image-watermark'].includes(id)&&<label className="field-label">{id==='pdf-split'?'Pages to extract':id==='image-crop'?'Crop rectangle (x,y,width,height)':id==='image-color'?'Pixel coordinate (x,y)':id==='pdf-rotate'?'Rotation degrees':id==='image-watermark'?'Watermark text':'Watermark text'}<input value={id==='image-watermark'?secondary:input} onChange={e=>id==='image-watermark'?setSecondary(e.target.value):setInput(e.target.value)} placeholder={help[id]}/></label>}
        {help[id]&&<div className="subtle-hint">{help[id]}</div>}
        <div className="workspace-actions"><button className="button-primary" disabled={busy} onClick={run}>{busy?'Processing...':'Run tool'} <span>→</span></button><button className="button-secondary" onClick={()=>{requestId.current+=1;setBusy(false);setInput('');setSecondary('');setFiles([]);setOutput(null);setError('')}}><RotateCcw size={15}/> Reset</button></div>
      </>}
      {error&&<div className="notice error"><AlertCircle size={17}/>{error}</div>}
      {output?.kind==='text'&&<div className="output-panel"><div className="output-heading"><strong>Result</strong><button className="button-secondary" onClick={()=>{if(!navigator.clipboard?.writeText){setError('Clipboard access is unavailable. Select and copy the result manually.');return}navigator.clipboard.writeText(output.value).catch(()=>setError('Clipboard access is unavailable. Select and copy the result manually.'))}}><Copy size={14}/> Copy</button></div><textarea readOnly rows={Math.min(16,Math.max(5,output.value.split('\n').length))} value={output.value}/></div>}
      {output?.kind==='blob'&&<div className="output-panel"><div className="output-heading"><strong>Result ready</strong><button className="button-primary small" onClick={download}><Download size={14}/> Download {output.filename}</button></div>{output.preview==='image'&&<img className="result-image" src={previewUrl} alt="Processed output"/>}{output.preview==='pdf'&&<span className="download-ready">PDF created successfully. Download it to view the document.</span>}<span className="subtle-hint">{output.filename} · {(output.blob.size/1024).toFixed(1)} KB</span></div>}
      {output?.kind==='html'&&<div className="output-panel"><div className="output-heading"><strong>Preview</strong></div><iframe title="HTML preview" sandbox="" referrerPolicy="no-referrer" srcDoc={output.value} className="html-preview-frame"/></div>}
    </div>
    <div className="privacy-note"><ShieldCheck size={17}/><span><strong>Privacy first.</strong> Processing happens locally for supported tools. Nothing is uploaded to an AP TOOLS server.</span></div>
  </motion.div>
}

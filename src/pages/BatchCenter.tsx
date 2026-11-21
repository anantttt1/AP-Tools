
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Layers, FileUp, Play, ShieldCheck } from 'lucide-react'
import JSZip from 'jszip'
import { processTool, type ProcessResult } from '../lib/processor'
import { downloadBlob } from '../lib/download'

const csvCell=(value:string)=>{const safe=/^[\s]*[=+\-@]/.test(value)?`'${value}`:value;return `"${safe.replace(/"/g,'""')}"`}
const operations=[
  {id:'image-compress',name:'Compress images',accept:'image/*'},
  {id:'image-convert',name:'Convert images to WebP',accept:'image/*'},
  {id:'image-grayscale',name:'Convert images to grayscale',accept:'image/*'},
  {id:'file-hash',name:'Generate SHA-256 checksums',accept:'*/*'},
  {id:'file-type',name:'Inspect file types',accept:'*/*'}
]
export default function BatchCenter(){
  const [files,setFiles]=useState<File[]>([])
  const [operation,setOperation]=useState(operations[0].id)
  const [quality,setQuality]=useState(80)
  const [busy,setBusy]=useState(false)
  const [progress,setProgress]=useState(0)
  const [error,setError]=useState('')
  const [result,setResult]=useState('')
  const chooseFiles=(list:File[])=>{
    if(list.length>100){setFiles([]);setError('Batch processing is limited to 100 files at a time.');return}
    if(list.some(file=>file.size>120*1024*1024)||list.reduce((sum,file)=>sum+file.size,0)>120*1024*1024){setFiles([]);setError('Selected files exceed the 120 MB batch limit.');return}
    setFiles(list);setError('');setResult('')
  }
  const run=async()=>{
    if(!files.length){setError('Choose at least one file.');return}
    if(files.length>100){setError('Batch processing is limited to 100 files at a time.');return}
    if(files.reduce((sum,f)=>sum+f.size,0)>120*1024*1024){setError('Selected files exceed the 120 MB batch limit.');return}
    setBusy(true);setError('');setResult('');setProgress(0)
    try{
      const zip=new JSZip()
      const rows:string[]=['filename,result'];let outputBytes=0
      for(let i=0;i<files.length;i++){
        const f=files[i]
        const r:ProcessResult=await processTool(operation,[f],'','',{quality,width:1600,height:1600,format:'image/webp'})
        if(r.kind==='blob'){outputBytes+=r.blob.size;if(outputBytes>160*1024*1024)throw new Error('Batch output exceeds the 160 MB download limit.');const base=(f.name.split('/').pop()||'file').replace(/[^a-z0-9._-]+/gi,'_').replace(/^\.+/,'').slice(0,120)||'file';zip.file(`${i+1}-${base}.${r.filename.split('.').pop()}`,r.blob)}
        else {const row=`${csvCell(f.name)},${csvCell(r.kind==='text'?r.value:'HTML output')}`;rows.push(row)}
        setProgress(Math.round((i+1)/files.length*100))
      }
      if(operation==='file-hash'||operation==='file-type'){const csv=new Blob([rows.join('\n')]);outputBytes+=csv.size;if(outputBytes>160*1024*1024)throw new Error('Batch output exceeds the 160 MB download limit.');zip.file('results.csv',csv)}const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:4}});if(blob.size>160*1024*1024)throw new Error('Batch output exceeds the 160 MB download limit.')
      downloadBlob(blob,'ap-tools-batch-results.zip')
      setResult(`${files.length} files processed. Your ZIP download has started.`)
    }catch(e){setError(e instanceof Error?e.message:'Batch processing failed.')}
    finally{setBusy(false)}
  }
  return <motion.div className="page-stack" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
    <div className="page-heading"><div><div className="eyebrow">MULTI-FILE WORKSPACE</div><h1>Batch center</h1><p>Process multiple files locally and download the results together.</p></div><div className="page-heading-icon"><Layers/></div></div>
    <div className="workspace-card">
      <div className="workspace-top"><div><strong>Batch operation</strong><p>Choose one operation and apply it to each selected file.</p></div><span className="local-badge"><span/> Browser-based</span></div>
      <label className="field-label">Operation<select value={operation} onChange={e=>setOperation(e.target.value)}>{operations.map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select></label>
      {operation==='image-compress'&&<label className="field-label">Image quality · {quality}%<input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></label>}
      <div className="upload-zone" onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add('dragging')}} onDragLeave={e=>e.currentTarget.classList.remove('dragging')} onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove('dragging');chooseFiles(Array.from(e.dataTransfer.files))}}><input id="batch-files" type="file" multiple accept={operations.find(o=>o.id===operation)?.accept} onChange={e=>{chooseFiles(Array.from(e.target.files||[]));e.currentTarget.value=''}}/><label htmlFor="batch-files"><FileUp size={28}/><strong>Choose multiple files</strong><span>Files remain on this device.</span></label>{files.length>0&&<div className="selected-files">{files.map((f,i)=><div key={i}>{f.name}<span>{(f.size/1024).toFixed(1)} KB</span></div>)}</div>}</div>
      {busy&&<div className="batch-progress"><div><span>Processing files</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{width:`${progress}%`}}/></div></div>}
      <div className="workspace-actions"><button className="button-primary" disabled={busy||!files.length} onClick={run}><Play size={15}/>{busy?'Processing...':'Process all files'}</button><button className="button-secondary" onClick={()=>{setFiles([]);setError('');setResult('');setProgress(0)}}>Reset</button></div>
      {error&&<div className="notice error">{error}</div>}{result&&<div className="notice success"><Download size={16}/>{result}</div>}
    </div>
    <div className="privacy-note"><ShieldCheck size={17}/><span><strong>Local processing.</strong> Selected files are handled by your browser and are not uploaded to an AP TOOLS server.</span></div>
  </motion.div>
}


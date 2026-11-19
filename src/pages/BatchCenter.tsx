
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Layers, FileUp, Play, ShieldCheck } from 'lucide-react'
import JSZip from 'jszip'
import { processTool, type ProcessResult } from '../lib/processor'
import { tools } from '../data/tools'

export default function BatchCenter() {
  const [files, setFiles] = useState<File[]>([])
  const [toolId, setToolId] = useState('file-hash')
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<{ name: string; result: ProcessResult }[]>([])
  const [error, setError] = useState('')

  const onFiles = (list: FileList | null) => {
    if (!list) return
    setFiles(Array.from(list).slice(0, 50))
    setResults([])
    setError('')
  }

  const run = async () => {
    if (!files.length) return
    setBusy(true)
    setError('')
    const out: { name: string; result: ProcessResult }[] = []
    try {
      for (const file of files) {
        const result = await processTool(toolId, file)
        out.push({ name: file.name, result })
      }
      setResults(out)
    } catch (e: any) {
      setError(e?.message || 'Batch processing failed')
    } finally {
      setBusy(false)
    }
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    for (const { name, result } of results) {
      if (result.blob) zip.file(name + (result.ext || ''), result.blob)
      else if (result.text) zip.file(name + '.txt', result.text)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ap-tools-batch.zip'
    a.click()
  }

  const batchable = tools.filter(t => ['Files', 'Images', 'Text'].includes(t.category)).slice(0, 30)

  return (
    <motion.div className="stack" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="page-head"><div><label>BATCH</label><h1>Batch Center</h1><p>Apply the same tool to many files and download results as ZIP.</p></div></div>
      <div className="card">
        <label className="drop" htmlFor="batch-files"><FileUp size={22}/><span>Drop files or click to select (max 50)</span></label>
        <input id="batch-files" type="file" multiple hidden onChange={e => onFiles(e.target.files)} />
        {files.length > 0 && <p>{files.length} file(s) selected</p>}
        <select value={toolId} onChange={e => setToolId(e.target.value)}>
          {batchable.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button className="primary" disabled={busy || !files.length} onClick={run}><Play size={16}/> {busy ? 'Processing…' : 'Run batch'}</button>
        {error && <p role="alert">{error}</p>}
        {results.length > 0 && <button onClick={downloadZip}><Download size={16}/> Download ZIP</button>}
      </div>
      <div className="hint"><ShieldCheck size={16}/><span>Files are processed locally in your browser and are not uploaded to an AP TOOLS server.</span></div>
    </motion.div>
  )
}

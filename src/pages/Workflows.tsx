import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, Play, Plus, Save, Trash2, Workflow as WorkflowIcon } from 'lucide-react'
import { tools } from '../data/tools'
import { processTool, type ProcessResult } from '../lib/processor'
import { downloadBlob } from '../lib/download'

type Step = { id: string; input: string; secondary: string }
type SavedWorkflow = { name: string; steps: Step[] }

const MAX_STEPS = 20
const MAX_SAVED = 50
const MAX_WORKFLOW_TEXT = 10_000_000

const readSaved = (): SavedWorkflow[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('ap-tools-workflows') || '[]')
    if (!Array.isArray(value)) return []
    const known = new Set(tools.map(tool => tool.id))
    return value.flatMap((item: any) => {
      if (!item || typeof item.name !== 'string' || item.name.length > 80 || !Array.isArray(item.steps) || item.steps.length < 1 || item.steps.length > MAX_STEPS) return []
      const valid = item.steps.every((step: any) => step && typeof step.id === 'string' && known.has(step.id) && typeof step.input === 'string' && step.input.length <= MAX_WORKFLOW_TEXT && (step.secondary === undefined || typeof step.secondary === 'string' && step.secondary.length <= MAX_WORKFLOW_TEXT))
      if (!valid) return []
      return [{ name: item.name, steps: item.steps.map((step: any) => ({ id: step.id, input: step.input, secondary: typeof step.secondary === 'string' ? step.secondary : '' })) }]
    }).slice(-MAX_SAVED)
  } catch {
    return []
  }
}

export default function Workflows() {
  const [steps, setSteps] = useState<Step[]>([{ id: 'remove-spaces', input: '', secondary: '' }, { id: 'slug-generator', input: '', secondary: '' }])
  const [saved, setSaved] = useState<SavedWorkflow[]>(readSaved)
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('My workflow')
  const options = useMemo(() => tools.filter(tool => !['stopwatch', 'countdown', 'pomodoro', 'notes', 'todo'].includes(tool.id)), [])

  const save = () => {
    const totalText = steps.reduce((sum, step) => sum + step.input.length + step.secondary.length, 0)
    if (!steps.length || steps.length > MAX_STEPS || totalText > MAX_WORKFLOW_TEXT) {
      setError('A workflow must contain 1–20 steps and no more than 10 MB of text in total.')
      return
    }
    if (steps.some(step => ['text-encrypt', 'text-decrypt', 'hmac-sha256'].includes(step.id) && step.secondary.length > 0)) {
      setError('For privacy, remove encryption passwords before saving this workflow. Saved workflows are stored unencrypted in this browser.')
      return
    }
    const next = [...saved, { name: (name.trim() || `Workflow ${saved.length + 1}`).slice(0, 80), steps: steps.map(step => ({ ...step })) }].slice(-MAX_SAVED)
    try {
      localStorage.setItem('ap-tools-workflows', JSON.stringify(next))
      setSaved(next)
      setError('')
    } catch {
      setError('Could not save workflow: browser storage is full or disabled.')
    }
  }

  const run = async () => {
    if (!steps.length || steps.length > MAX_STEPS) {
      setError('A workflow must contain 1–20 steps.')
      return
    }
    if (steps.reduce((sum, step) => sum + step.input.length + step.secondary.length, 0) > MAX_WORKFLOW_TEXT) {
      setError('Workflow text exceeds the 10 MB safety limit.')
      return
    }
    if (files.some(file => file.size > 80 * 1024 * 1024) || files.length > 250 || files.reduce((sum, file) => sum + file.size, 0) > 80 * 1024 * 1024) {
      setError('Starting files are limited to 250 files and 80 MB total.')
      return
    }
    if (steps.some(step => !tools.some(tool => tool.id === step.id))) {
      setError('This workflow contains an unsupported tool. Remove or replace that step before running.')
      return
    }
    setBusy(true)
    setError('')
    setResult('')
    try {
      let currentFiles = files
      let currentText = steps[0]?.input || ''
      let last: ProcessResult | null = null
      for (const step of steps) {
        last = await processTool(step.id, currentFiles, step.input || currentText, step.secondary || '')
        if (last.kind === 'text') {
          currentText = last.value
          currentFiles = []
        } else if (last.kind === 'blob') {
          currentFiles = [new File([last.blob], last.filename, { type: last.blob.type })]
          currentText = ''
        } else {
          currentText = last.value
          currentFiles = []
        }
      }
      if (last?.kind === 'text' || last?.kind === 'html') setResult(last.value)
      else if (last?.kind === 'blob') {
        downloadBlob(last.blob, last.filename)
        setResult(`Final output downloaded: ${last.filename}`)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Workflow failed.')
    } finally {
      setBusy(false)
    }
  }

  return <motion.div className="page-stack" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div className="page-heading"><div><div className="eyebrow">AUTOMATION WORKSPACE</div><h1>Workflow studio</h1><p>Chain supported browser tools into reusable local workflows.</p></div><div className="page-heading-icon"><WorkflowIcon/></div></div>
    <div className="workspace-card">
      <div className="workspace-top"><div><strong>Build a workflow</strong><p>Steps run in order. Text and file outputs are passed to the next step.</p></div><span className="local-badge"><span/> Saved locally</span></div>
      <label className="field-label">Workflow name<input maxLength={80} value={name} onChange={e => setName(e.target.value)}/></label>
      <label className="field-label">Starting files (optional)<input type="file" multiple onChange={e => { setFiles(Array.from(e.target.files || [])); e.currentTarget.value = '' }}/></label>
      <div className="workflow-steps">
        {steps.map((step, i) => <div className="workflow-step" key={i}>
          <div className="step-number">{i + 1}</div>
          <div className="step-fields">
            <select value={step.id} onChange={e => setSteps(current => current.map((item, j) => j === i ? { ...item, id: e.target.value } : item))}>
              {options.map(tool => <option value={tool.id} key={tool.id}>{tool.name}</option>)}
            </select>
            <input maxLength={MAX_WORKFLOW_TEXT} value={step.input} onChange={e => setSteps(current => current.map((item, j) => j === i ? { ...item, input: e.target.value } : item))} placeholder="Input text or file-specific options (blank passes previous step output)"/>
            <input maxLength={MAX_WORKFLOW_TEXT} value={step.secondary} onChange={e => setSteps(current => current.map((item, j) => j === i ? { ...item, secondary: e.target.value } : item))} placeholder="Optional second input (for example: password, pattern, percentage)"/>
          </div>
          <div className="step-controls">
            <button className="icon-button" aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => setSteps(current => { const next = [...current]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; return next })}><ArrowUp size={15}/></button>
            <button className="icon-button" aria-label={`Move step ${i + 1} down`} disabled={i === steps.length - 1} onClick={() => setSteps(current => { const next = [...current]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; return next })}><ArrowDown size={15}/></button>
            <button className="icon-button" aria-label={`Remove step ${i + 1}`} disabled={steps.length === 1} onClick={() => setSteps(current => current.filter((_, j) => j !== i))}><Trash2 size={15}/></button>
          </div>
        </div>)}
      </div>
      <div className="workspace-actions">
        <button className="button-secondary" onClick={() => setSteps(current => current.length >= MAX_STEPS ? current : [...current, { id: 'json-format', input: '', secondary: '' }])} disabled={steps.length >= MAX_STEPS}><Plus size={15}/> Add step</button>
        <button className="button-secondary" onClick={save}><Save size={15}/> Save workflow</button>
        <button className="button-primary" disabled={busy} onClick={run}><Play size={15}/> {busy ? 'Running...' : 'Run workflow'}</button>
      </div>
      {error && <div className="notice error" role="alert">{error}</div>}
      {result && <div className="notice success">{result}</div>}
    </div>
    {saved.length > 0 && <div className="section-block"><div className="section-heading"><div><h2>Saved workflows</h2><p>Stored on this device only, without encryption.</p></div></div><div className="saved-workflows">{saved.map((workflow, i) => <button className="saved-workflow" key={`${workflow.name}-${i}`} onClick={() => { setSteps(workflow.steps.map(step => ({ ...step }))); setName(workflow.name) }}><strong>{workflow.name}</strong><span>{workflow.steps.length} steps</span></button>)}</div></div>}
  </motion.div>
}


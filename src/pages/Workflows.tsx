import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp, Play, Plus, Save, Trash2, Workflow as WorkflowIcon } from 'lucide-react'
import { tools } from '../data/tools'

export default function Workflows() {
  const [steps, setSteps] = useState<{ id: string; toolId: string }[]>([])
  const [name, setName] = useState('My workflow')

  const add = () => setSteps(s => [...s, { id: crypto.randomUUID(), toolId: tools[0]?.id || 'file-hash' }])
  const remove = (id: string) => setSteps(s => s.filter(x => x.id !== id))
  const move = (idx: number, dir: -1 | 1) => {
    setSteps(s => {
      const next = [...s]
      const j = idx + dir
      if (j < 0 || j >= next.length) return s
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return next
    })
  }

  const save = () => {
    try {
      const key = 'ap-tools-workflows'
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      const entry = { name, steps: steps.map(s => s.toolId), savedAt: Date.now() }
      localStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 20)))
      alert('Workflow saved locally')
    } catch {
      alert('Could not save workflow')
    }
  }

  return (
    <motion.div className="stack" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="page-head"><div><label>WORKFLOWS</label><h1>Workflow Studio</h1><p>Chain supported browser processors. Saved locally in this browser.</p></div></div>
      <div className="card">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Workflow name" />
        <button onClick={add}><Plus size={16}/> Add step</button>
        <button onClick={save} disabled={!steps.length}><Save size={16}/> Save</button>
      </div>
      <div className="workflow-steps">
        {steps.map((step, i) => (
          <div key={step.id} className="workflow-step">
            <select value={step.toolId} onChange={e => setSteps(s => s.map(x => x.id === step.id ? { ...x, toolId: e.target.value } : x))}>
              {tools.slice(0, 40).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp size={14}/></button>
            <button onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown size={14}/></button>
            <button onClick={() => remove(step.id)} aria-label="Remove"><Trash2 size={14}/></button>
          </div>
        ))}
        {steps.length === 0 && <div className="empty"><WorkflowIcon size={28}/><p>Add steps to build a workflow.</p></div>}
      </div>
    </motion.div>
  )
}

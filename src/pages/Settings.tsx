import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, ShieldCheck } from 'lucide-react'

export default function Settings() {
  const [error, setError] = useState('')
  const clear = () => {
    if (!confirm('Clear AP TOOLS favorites, history, notes, tasks and workflows from this browser?')) return
    try {
      ['ap-favs', 'ap-recent', 'ap-collapsed', 'ap-tools-note', 'ap-tools-tasks', 'ap-tools-workflows'].forEach(key => localStorage.removeItem(key))
      location.reload()
    } catch {
      setError('Browser storage could not be cleared. Check your browser privacy settings and try again.')
    }
  }
  return <motion.div className="stack" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div className="page-head"><div><label>PREFERENCES</label><h1>Settings</h1><p>Manage your local AP TOOLS experience.</p></div></div>
    <section className="settings-panel">
      <div><b>Appearance</b><p>Minimal light theme · Advanced motion · Collapsible sidebar</p><span>Light theme</span></div>
      <div><b>Privacy</b><p>Supported file operations happen locally in your browser.</p><ShieldCheck color="#16a36a"/></div>
      <div><b>Local data</b><p>Clear favorites, history, notes, tasks and saved workflows from this browser.</p><button className="danger" onClick={clear}><Trash2 size={15}/> Clear local data</button>{error&&<p role="alert">{error}</p>}</div>
      <div><b>About AP TOOLS</b><p>Free everyday utilities in one place. No account required.</p></div>
    </section>
  </motion.div>
}

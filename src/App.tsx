import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tools from './pages/Tools'
import ToolPage from './pages/ToolPage'
import Workspace from './pages/Workspace'
import Settings from './pages/Settings'
import Workflows from './pages/Workflows'
import BatchCenter from './pages/BatchCenter'

function NotFound() {
  return <div className="empty"><strong>Page not found</strong><p>The page you're looking for doesn't exist.</p></div>
}
export default function App() {
  return <Routes><Route element={<Layout/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/tools" element={<Tools/>}/>
    <Route path="/tool/:id" element={<ToolPage/>}/>
    <Route path="/batch" element={<BatchCenter/>}/>
    <Route path="/workflows" element={<Workflows/>}/>
    <Route path="/workspace" element={<Workspace mode="workspace"/>}/>
    <Route path="/favorites" element={<Workspace mode="favorites"/>}/>
    <Route path="/recent" element={<Workspace mode="recent"/>}/>
    <Route path="/settings" element={<Settings/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Route></Routes>
}

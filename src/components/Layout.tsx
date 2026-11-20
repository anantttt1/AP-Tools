
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { Layers3, LayoutDashboard, Grid2X2, Heart, History, Workflow, Settings, PanelLeftClose, PanelLeftOpen, Search, Menu, Layers, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const nav = [
  ['/', 'Overview', LayoutDashboard],
  ['/tools', 'All tools', Grid2X2],
  ['/batch', 'Batch center', Layers],
  ['/workspace', 'My workspace', Layers3],
  ['/favorites', 'Favorites', Heart],
  ['/recent', 'Recently used', History],
  ['/workflows', 'Workflow studio', Workflow],
  ['/settings', 'Settings', Settings],
] as const

export default function Layout() {
  const collapsed = useAppStore(s => s.collapsed)
  const toggle = useAppStore(s => s.toggleSidebar)
  const [mobile, setMobile] = useState(false)
  const go = useNavigate()
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        go('/tools')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])
  return <div className="shell">
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobile ? 'mobile-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><Layers3 size={21}/></div>
        {!collapsed && <div><b>AP <span>TOOLS</span></b><small>ALL YOUR TOOLS. ONE PLACE.</small></div>}
        <button className="mobile-close" onClick={() => setMobile(false)} aria-label="Close navigation"><X size={17}/></button>
      </div>
      <div className="nav-label">{!collapsed && 'WORKSPACE'}</div>
      <nav>{nav.map(([to,label,Icon]) =>
        <NavLink key={to} to={to} end={to === '/'} title={collapsed ? label : undefined}
          onClick={() => setMobile(false)}
          className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
          aria-label={label}>
          <Icon size={19}/>{!collapsed && <span>{label}</span>}
        </NavLink>
      )}</nav>
      {!collapsed && <div className="sidebar-promo"><strong>Simple. Powerful. Free.</strong><p>Useful tools that work right in your browser.</p></div>}
      <div className="sidebar-spacer"/>
      <div className="sidebar-bottom"><button onClick={toggle}>{collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>} {!collapsed && 'Collapse sidebar'}</button></div>
    </aside>
    <section className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobile(v => !v)} aria-label="Open navigation"><Menu size={19}/></button>
        <button className="top-search" onClick={() => go('/tools')}><Search size={17}/>Search for a tool...<kbd>Ctrl K</kbd></button>
        <span className="free-tag">● Free tools</span><div className="avatar">AP</div>
      </header>
      <main className="content"><Outlet/></main>
      <footer>© {new Date().getFullYear()} AP TOOLS <span>Free tools · Private processing · No account required</span><div className="footer-legal-links"><Link className="footer-privacy-link" to="/privacy">Privacy Policy</Link><Link className="footer-privacy-link" to="/terms">Terms &amp; Conditions</Link></div></footer>
    </section>
    {mobile && <button className="scrim" onClick={() => setMobile(false)} aria-label="Close navigation"/>}
  </div>
}

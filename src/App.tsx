
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { tools } from './data/tools'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tools from './pages/Tools'
import ToolPage from './pages/ToolPage'
import Workspace from './pages/Workspace'
import Settings from './pages/Settings'
import Workflows from './pages/Workflows'
import BatchCenter from './pages/BatchCenter'
import Privacy from './pages/Privacy'

function NotFound() {
  return <div className="empty"><strong>Page not found</strong><p>The page you're looking for doesn't exist.</p></div>
}

const routeMeta: Record<string,{title:string;description:string;index?:boolean}> = {
  '/': {
    title: 'AP Creative Tools — Free Online PDF, Image & File Tools',
    description: 'Free online PDF, image, file, text, developer and calculator tools. Merge and split PDFs, compress images, convert files and format data in your browser.'
  },
  '/tools': {
    title: 'All 208 Free Online Tools | AP Creative Tools',
    description: 'Browse 208 free browser-based PDF, image, file, text, developer, validation and calculator tools in AP Creative Tools.'
  },
  '/batch': {
    title: 'Batch File Tools Online | AP Creative Tools',
    description: 'Run supported browser-based file operations in batches and download the results from AP Creative Tools.'
  },
  '/workflows': {
    title: 'Online Workflow Studio | AP Creative Tools',
    description: 'Chain supported browser-based utilities into reusable local workflows with AP Creative Tools.'
  },
  '/workspace': {
    title: 'Your Workspace | AP Creative Tools',
    description: 'Open your recent and saved tools in AP Creative Tools.',
    index: false
  },
  '/favorites': {
    title: 'Favorite Tools | AP Creative Tools',
    description: 'Your locally saved favorite tools in AP Creative Tools.',
    index: false
  },
  '/recent': {
    title: 'Recently Used Tools | AP Creative Tools',
    description: 'Your locally stored recent tools in AP Creative Tools.',
    index: false
  },
  '/privacy': {\n    title: 'Privacy Policy | AP Creative Tools',\n    description: 'Read how AP Creative Tools handles information, browser-based file processing, local storage, third-party services and your privacy choices.'\n  },\n  '/settings': {
    title: 'Settings | AP Creative Tools',
    description: 'Manage local AP Creative Tools preferences.',
    index: false
  }
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    const match = /^\/tool\/([^/]+)\/?$/.exec(pathname)
    const toolId = match ? decodeURIComponent(match[1]) : ''
    const tool = toolId ? tools.find(item => item.id === toolId) : undefined
    const route = routeMeta[pathname.replace(/\/+$/, '') || '/']
    const isKnownTool = Boolean(tool)
    const title = tool
      ? tool.name + ' Online Free | AP Creative Tools'
      : route?.title || 'Page not found | AP Creative Tools'
    const description = tool
      ? tool.name + ': ' + tool.description + ' Use this free online ' + tool.category.toLowerCase() + ' tool in your browser with no account required.'
      : route?.description || 'The requested page is not available on AP Creative Tools.'
    const shouldIndex = (isKnownTool || Boolean(route)) && route?.index !== false
    const canonicalPath = tool ? '/tool/' + tool.id : pathname.replace(/\/+$/, '') || '/'
    const canonical = window.location.origin + canonicalPath
    const setMeta = (name:string,value:string,property=false) => {
      const selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]'
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        if (property) element.setAttribute('property',name)
        else element.name = name
        document.head.appendChild(element)
      }
      element.content = value
    }

    document.title = title
    setMeta('description', description)
    setMeta('robots', shouldIndex ? 'index,follow,max-image-preview:large' : 'noindex,follow')
    setMeta('og:site_name','AP Creative Tools',true)
    setMeta('og:type','website',true)
    setMeta('og:title',title,true)
    setMeta('og:description',description,true)
    setMeta('og:url',canonical,true)
    setMeta('twitter:card','summary')
    setMeta('twitter:title',title)
    setMeta('twitter:description',description)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (shouldIndex) {
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    } else if (link) {
      link.remove()
    }
  }, [pathname])

  return <Routes><Route element={<Layout/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/tools" element={<Tools/>}/>
    <Route path="/tool/:id" element={<ToolPage/>}/>
    <Route path="/batch" element={<BatchCenter/>}/>
    <Route path="/workflows" element={<Workflows/>}/>
    <Route path="/workspace" element={<Workspace mode="workspace"/>}/>
    <Route path="/favorites" element={<Workspace mode="favorites"/>}/>
    <Route path="/recent" element={<Workspace mode="recent"/>}/>
    <Route path="/settings" element={<Settings/>}/>\n    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Route></Routes>
}

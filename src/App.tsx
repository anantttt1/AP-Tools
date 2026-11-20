
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
import Terms from './pages/Terms'

function NotFound() {
  return <div className="empty"><strong>Page not found</strong><p>The page you're looking for doesn't exist.</p></div>
}

const routeMeta: Record<string,{title:string;description:string;index?:boolean}> = {
  '/': {
    title: 'AP Creative Tools — Free Online PDF, Image & File Tools',
    description: 'Free online PDF, image, file, text, developer and calculator tools. Merge and split PDFs, compress images, convert files and format data in your browser.'
  },
  '/tools': {
    title: 'All 318 Free Online Tools | AP Creative Tools',
    description: 'Browse 318 free browser-based PDF, image, file, text, developer, validation and calculator tools in AP Creative Tools.'
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
  '/privacy': {
    title: 'Privacy Policy | AP Creative Tools',
    description: 'Read how AP Creative Tools handles information, browser-based file processing, local storage, third-party services and your privacy choices.'
  },
  '/terms': {
    title: 'Terms & Conditions | AP Creative Tools',
    description: 'Read the terms governing access to and use of AP Creative Tools, including file processing, intellectual property, service availability and user responsibilities.'
  },
  '/settings': {
    title: 'Settings | AP Creative Tools',
    description: 'Manage local AP Creative Tools preferences.',
    index: false
  }
}

const toolSeo: Record<string,{title:string;description:string}> = {
  'qr-generator': { title: 'Free QR Code Generator — Create QR Codes Online | AP Creative Tools', description: 'Create a QR code online for a website URL, plain text or contact details. Generate and download your QR code free in your browser. No sign-up; your input stays on your device.' },
  'barcode': { title: 'Free Barcode Generator Online | AP Creative Tools', description: 'Generate a barcode online with AP Creative Tools. Create and download a barcode in your browser for supported barcode formats, with no account required.' },
  'pdf-merge': { title: 'Merge PDF Files Online Free — Combine PDFs | AP Creative Tools', description: 'Combine multiple PDF files into one document online. Arrange your files, merge PDF pages and download the result. Free browser-based PDF merger; files stay on your device.' },
  'pdf-split': { title: 'Split PDF Online Free — Extract PDF Pages | AP Creative Tools', description: 'Split a PDF or extract selected pages by page number. Create a smaller PDF from the pages you need with this free browser-based PDF splitter.' },
  'pdf-compress': { title: 'Compress PDF Online — Reduce PDF File Size | AP Creative Tools', description: 'Optimize a PDF by re-saving supported document structures in your browser. Results depend on the PDF contents; check the output size before sharing.' },
  'pdf-to-word': { title: 'PDF to Word Converter Online — PDF to DOCX | AP Creative Tools', description: 'Extract selectable text from a PDF into an editable Word DOCX file. Browser-based conversion; scanned pages need OCR and complex layouts may not be preserved.' },
  'word-to-pdf': { title: 'Word to PDF Converter Online — DOCX to PDF | AP Creative Tools', description: 'Convert a DOCX Word document to PDF in your browser. Extracts text and paragraph order; advanced formatting, tables and images may not be preserved.' },
  'pdf-to-powerpoint': { title: 'PDF to PPT Converter Online — PDF to PowerPoint | AP Creative Tools', description: 'Convert PDF pages into PowerPoint slides in a PPTX file. Each page is placed as a slide image, so the visual page is preserved but content is not individually editable.' },
  'powerpoint-to-pdf': { title: 'PPT to PDF Converter Online — PowerPoint to PDF | AP Creative Tools', description: 'Convert a PPTX PowerPoint presentation to PDF in your browser. Image-based slides are preserved; complex slide layouts may be simplified.' },
  'image-compress': { title: 'Compress Image Online — Free JPG, PNG & WebP Compressor | AP Creative Tools', description: 'Compress images online and choose output quality and format. Optimize supported JPG, PNG and WebP images locally in your browser without uploading them.' },
  'image-resize': { title: 'Resize Image Online — Free Photo Resizer | AP Creative Tools', description: 'Resize an image by setting maximum width and height. Create smaller photos and graphics in your browser without sending files to a server.' },
  'image-convert': { title: 'Image Converter Online — Convert PNG, JPG & WebP | AP Creative Tools', description: 'Convert images between supported PNG, JPEG and WebP formats. Choose an output format and download the converted image from your browser.' },
  'json-format': { title: 'JSON Formatter & Validator Online | AP Creative Tools', description: 'Format, pretty-print and validate JSON data online. Find syntax errors and make JSON easier to read with this free browser-based developer tool.' },
  'csv-json': { title: 'CSV to JSON Converter Online Free | AP Creative Tools', description: 'Convert CSV data into JSON objects in your browser. Parse rows and headers into structured JSON and copy or download the result.' },
  'json-csv': { title: 'JSON to CSV Converter Online Free | AP Creative Tools', description: 'Convert arrays of JSON objects into CSV data. Export structured records as a spreadsheet-friendly CSV file using this free online converter.' },
  'word-counter': { title: 'Word Counter Online — Count Words & Characters | AP Creative Tools', description: 'Count words, characters, sentences and paragraphs instantly. A free online word and character counter for writing, essays and documents.' },
  'password': { title: 'Secure Password Generator Online Free | AP Creative Tools', description: 'Generate a random password with a chosen length using browser cryptographic randomness. Create a strong password locally without an account.' }
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    const match = /^\/tool\/([^/]+)\/?$/.exec(pathname)
    const toolId = match ? decodeURIComponent(match[1]) : ''
    const tool = toolId ? tools.find(item => item.id === toolId) : undefined
    const route = routeMeta[pathname.replace(/\/+$/, '') || '/']
    const isKnownTool = Boolean(tool)
    const seoEntry = tool ? toolSeo[tool.id] : undefined
    const title = tool
      ? (seoEntry?.title || tool.name + ' Online Free | AP Creative Tools')
      : route?.title || 'Page not found | AP Creative Tools'
    const description = tool
      ? (seoEntry?.description || tool.name + ': ' + tool.description + ' Use this free online ' + tool.category.toLowerCase() + ' tool in your browser with no account required.')
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

    let structuredData = document.head.querySelector<HTMLScriptElement>('#ap-tools-structured-data')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.id = 'ap-tools-structured-data'
      structuredData.type = 'application/ld+json'
      document.head.appendChild(structuredData)
    }
    structuredData.textContent = JSON.stringify(tool ? {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name + ' — AP Creative Tools',
      description,
      url: canonical,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'AP Creative Tools', url: window.location.origin }
    } : pathname === '/' ? {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AP Creative Tools',
      url: window.location.origin,
      description: 'Free browser-based PDF, image, file, text and developer tools.'
    } : null)

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
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="/terms" element={<Terms/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Route></Routes>
}

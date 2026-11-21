import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, ArrowRight, ArrowUpRight, FileText, Image, Code2, Archive, ShieldCheck, Zap } from 'lucide-react'
import { tools } from '../data/tools'
import ToolCard from '../components/ToolCard'

const cats = [
  ['Files', 'Compress, archive and manage files', Archive],
  ['PDF', 'Merge, split, convert and manage documents', FileText],
  ['Images', 'Resize, convert and optimize images', Image],
  ['Text', 'Clean, compare and transform text', FileText],
  ['Developer', 'Format, validate and inspect data', Code2],
  ['Encoding', 'Encode and decode text and data', Code2],
  ['Validation', 'Validate common data formats', ShieldCheck],
  ['Calculators', 'Solve everyday maths and date tasks', Zap],
  ['Converters', 'Convert units and number formats', Archive],
  ['Security', 'Generate hashes and secure text locally', ShieldCheck],
  ['QR & Barcode', 'Create QR codes and barcodes', Image],
  ['Utilities', 'Use practical productivity helpers', Zap],
] as const

const pdfToolIds = ['pdf-merge', 'pdf-split', 'pdf-rotate', 'pdf-watermark', 'pdf-page-numbers', 'pdf-text', 'pdf-images', 'images-pdf', 'pdf-inspector', 'pdf-remove-pages', 'pdf-organize-pages', 'pdf-split-every-page', 'pdf-header-footer', 'pdf-metadata-editor', 'pdf-crop', 'pdf-flatten-forms', 'pdf-compare']
const imageToolIds = ['image-compress', 'image-resize', 'image-convert', 'image-crop', 'image-rotate', 'image-watermark']
const getTools = (ids: string[]) => ids.map(id => tools.find(tool => tool.id === id)).filter((tool): tool is (typeof tools)[number] => Boolean(tool))

export default function Home() {
  const [q, setQ] = useState('')
  const go = useNavigate()
  const popular = ['image-compress', 'pdf-merge', 'zip-extractor', 'json-format', 'qr-generator', 'password'].map(id => tools.find(t => t.id === id)!).filter(Boolean)
  const pdfTools = getTools(pdfToolIds)
  const imageTools = getTools(imageToolIds)

  return <motion.div className="stack" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">● YOUR EVERYDAY DIGITAL TOOLKIT</div>
        <h1>Everything you need.<br /><span>One powerful workspace.</span></h1>
        <p>Free online PDF, image, file and productivity tools. Merge PDF files, split pages, add watermarks, convert images and manage everyday documents in one browser workspace.</p>
        <div className="hero-search"><Search /><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && go('/tools?q=' + encodeURIComponent(q))} placeholder="Search PDF, image and file tools..." /><button onClick={() => go('/tools?q=' + encodeURIComponent(q))}>Explore tools <ArrowRight size={16} /></button></div>
        <div className="hero-foot"><ShieldCheck size={15} /> Browser-based processing · No account required · Free to use</div>
      </div>
      <a className="hero-art" href="https://ap-creativestudio.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Open AP Creative Studio website in a new tab">
        <span className="hero-art-logo" aria-hidden="true">
          <span className="hero-liquid-pool" />
          <span className="hero-liquid hero-liquid-one" />
          <span className="hero-liquid hero-liquid-two" />
          <span className="hero-liquid hero-liquid-three" />
          <span className="hero-liquid hero-liquid-four" />
          <span className="hero-liquid hero-liquid-five" />
          <img src="/ap-creative-studio-logo.webp" alt="" />
          <span className="hero-liquid-glint" />
        </span>
        <span className="hero-art-copy"><strong>AP Creative Studio</strong><small>Open website <ArrowUpRight size={14} /></small></span>
      </a>
    </section>

    <section className="section">
      <div className="section-head"><div><label>GET STARTED</label><h2>Explore categories</h2><p>Find the right tool for the job.</p></div><button className="link-btn" onClick={() => go('/tools')}>View all tools <ArrowUpRight size={16} /></button></div>
      <div className="category-grid">{cats.map(([name, desc, Icon]) => <Link className="category-card" key={name} to={'/tools?category=' + encodeURIComponent(name)}><div className="category-icon"><Icon /></div><div><b>{name} tools</b><p>{desc}</p></div><ArrowUpRight className="cat-arrow" size={16} /></Link>)}</div>
    </section>

    <section className="section">
      <div className="section-head"><div><label>QUICK ACCESS</label><h2>Popular free online tools</h2><p>Get common file tasks done in fewer clicks.</p></div><button className="link-btn" onClick={() => go('/tools')}>Browse all <ArrowRight size={16} /></button></div>
      <div className="tool-grid">{popular.map(t => <ToolCard key={t.id} tool={t} onOpen={() => go('/tool/' + t.id)} />)}</div>
    </section>

    <section className="section">
      <div className="section-head"><div><label>PDF WORKSPACE</label><h2>Free online PDF tools</h2><p>Work with common PDF tasks directly in your browser. Select a tool to open its workspace.</p></div><button className="link-btn" onClick={() => go('/tools?category=PDF')}>All PDF tools <ArrowRight size={16} /></button></div>
      <div className="tool-grid">{pdfTools.map(t => <ToolCard key={t.id} tool={t} onOpen={() => go('/tool/' + t.id)} />)}</div>
      <p className="seo-copy">Use the PDF merger to combine documents, split a PDF to extract selected pages, rotate pages, add a text watermark or page numbers, extract selectable text, and inspect page dimensions. You can also turn PDF pages into images or combine images into a PDF. Processing for these supported tools takes place in your browser; file-size and browser-memory limits apply.</p>
    </section>

    <section className="section">
      <div className="section-head"><div><label>IMAGE WORKSPACE</label><h2>Free image converter and editor tools</h2><p>Prepare images for websites, documents, forms and everyday sharing.</p></div><button className="link-btn" onClick={() => go('/tools?category=Images')}>All image tools <ArrowRight size={16} /></button></div>
      <div className="tool-grid">{imageTools.map(t => <ToolCard key={t.id} tool={t} onOpen={() => go('/tool/' + t.id)} />)}</div>
    </section>

    <section className="section">
      <div className="section-head"><div><label>POPULAR WORKFLOWS</label><h2>Quick guides to common PDF and image tasks</h2><p>Open a dedicated guide, see the steps and launch the matching tool.</p></div></div>
      <div className="category-grid">
        <a className="category-card" href="/qr-code-generator/"><div><b>QR Code Generator</b><p>Create a QR code from a URL or text.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf-to-ppt/"><div><b>PDF to PPT converter</b><p>Turn PDF pages into PowerPoint slides.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/ppt-to-pdf/"><div><b>PPT to PDF converter</b><p>Convert supported PPTX presentations to PDF.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf/merge-pdf/"><div><b>Merge PDF online</b><p>Combine multiple PDF documents.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf/split-pdf/"><div><b>Split PDF online</b><p>Extract selected pages from a PDF.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf/rotate-pdf/"><div><b>Rotate PDF</b><p>Correct sideways or upside-down pages.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf/pdf-to-jpg/"><div><b>PDF to JPG</b><p>Render PDF pages as images.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf/jpg-to-pdf/"><div><b>JPG to PDF</b><p>Combine images into a PDF.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/images/compress-image/"><div><b>Compress image</b><p>Reduce image file size.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/images/resize-image/"><div><b>Resize image</b><p>Change image dimensions.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/pdf/add-watermark/"><div><b>Add PDF watermark</b><p>Label every page with text.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-remove-pages"><div><b>Remove PDF pages</b><p>Delete selected pages from a document.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-organize-pages"><div><b>Organize PDF pages</b><p>Reorder pages by page number.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-split-every-page"><div><b>Split every PDF page</b><p>Download each page as a separate PDF.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-compare"><div><b>Compare PDF text</b><p>Compare selectable text from two PDFs.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-header-footer"><div><b>Add PDF header and footer</b><p>Stamp text on every page.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-metadata-editor"><div><b>Edit PDF metadata</b><p>Update document title and author.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-crop"><div><b>Crop PDF pages</b><p>Set a consistent page crop area.</p></div><ArrowUpRight size={16}/></a>
        <a className="category-card" href="/tool/pdf-flatten-forms"><div><b>Flatten PDF forms</b><p>Flatten supported form fields.</p></div><ArrowUpRight size={16}/></a>
      </div>
    </section>

    <section className="section seo-copy">
      <label>WHY AP CREATIVE TOOLS</label><h2>Useful tools, without installing desktop software</h2>
      <p>AP Creative Tools is a browser-based collection of PDF, image, file, text and developer utilities. Open a tool, select the supported input and download the result. The platform does not require an account for its current tools.</p>
      <p><strong>Privacy:</strong> Supported file operations run locally in your browser and are not uploaded to an AP Creative Tools processing server. Your browser and device still control local file access and memory, so avoid using shared devices for sensitive documents.</p>
      <h2>Frequently asked questions</h2>
      <h3>Is AP Creative Tools free?</h3><p>The tools currently listed on the site are available without an account or paid subscription.</p>
      <h3>Are my PDF and image files uploaded?</h3><p>For supported local tools, processing happens in your browser. The site does not send selected files to an AP Creative Tools backend.</p>
      <h3>Can I merge or split PDF files online?</h3><p>Yes. Open Merge PDF to combine multiple PDF documents, or Split PDF to extract selected pages. Other available PDF utilities include rotation, watermarks, page numbers and text extraction.</p>
      <h3>Which document conversions are supported?</h3><p>Available browser-based conversions include PDF to PowerPoint (each PDF page becomes an image slide), supported PPTX to PDF, PDF to Word (selectable text extraction), and Word to PDF (best-effort text extraction from DOCX). These conversions do not guarantee preservation of complex layouts, charts, images or advanced formatting. Scanned-PDF OCR and legacy .ppt/.doc files are not supported.</p>
    </section>

    <div className="benefits"><div><Zap /><b>Fast by design</b><p>Lightweight tools with focused interfaces.</p></div><div><ShieldCheck /><b>Privacy first</b><p>Supported tasks run locally in your browser.</p></div><div><Image /><b>Always useful</b><p>A growing collection of everyday utilities.</p></div></div>
  </motion.div>
}


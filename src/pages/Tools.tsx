import{motion}from'framer-motion';import{Search}from'lucide-react';import{useMemo,useState}from'react';import{useNavigate,useSearchParams}from'react-router-dom';import{tools,categories}from'../data/tools';import ToolCard from'../components/ToolCard'
export default function Tools(){const[p,setP]=useSearchParams(),[q,setQ]=useState(p.get('q')||''),[cat,setCat]=useState(p.get('category')||'All Tools'),go=useNavigate();const searchAliases:Record<string,string[]> = {
  'pdf-to-powerpoint':['pdf to ppt','pdf2ppt','pdf to pptx','convert pdf to powerpoint','pdf powerpoint converter','pdf to slides'],
  'powerpoint-to-pdf':['ppt to pdf','pptx to pdf','powerpoint to pdf','ppt converter','pptx converter'],
  'qr-generator':['qr code generator','qr code maker','qr creator','create qr code','url to qr code','website to qr code','text to qr code'],
  'barcode':['barcode generator','barcode maker','create barcode'],
  'pdf-merge':['merge pdf','combine pdf','join pdf','pdf combiner'],
  'pdf-split':['split pdf','separate pdf pages','extract pdf pages'],
  'pdf-compress':['compress pdf','reduce pdf size','shrink pdf'],
  'pdf-to-word':['pdf to word','pdf to docx','convert pdf to doc'],
  'word-to-pdf':['word to pdf','docx to pdf','convert doc to pdf'],
  'image-compress':['image compressor','compress image','compress jpg','compress png','reduce image size'],
  'image-resize':['image resizer','resize photo','resize picture'],
  'image-convert':['image converter','png to jpg','jpg to png','webp converter'],
  'json-format':['json formatter','format json','json beautifier','json validator'],
  'csv-json':['csv to json','convert csv to json'],
  'json-csv':['json to csv','convert json to csv'],
  'word-counter':['word counter','character counter','count words']
}
const normalizedQuery=q.trim().toLowerCase().replace(/\s+/g,' ')
const list=useMemo(()=>tools.filter(t=>{
  if(cat!=='All Tools'&&t.category!==cat)return false
  const haystack=`${t.name} ${t.description} ${t.category} ${(searchAliases[t.id]||[]).join(' ')}`.toLowerCase()
  return !normalizedQuery||haystack.includes(normalizedQuery)
}),[normalizedQuery,cat]);return <motion.div className="stack" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><div className="page-head"><div><label>TOOL DIRECTORY</label><h1>Explore all tools</h1><p>Find the right utility and get straight to work.</p></div><span className="count">{tools.length} tools</span></div><div className="directory-search"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by tool name or task..."/></div><div className="filters">{categories.map(c=><button key={c} className={cat===c?'selected':''} onClick={()=>{setCat(c);setP(c==='All Tools'?{}:{category:c})}}>{c}</button>)}</div><div className="result-meta">{list.length} results <span>All tools are free to use</span></div>{list.length?<div className="tool-grid">{list.map(t=><ToolCard key={t.id} tool={t} onOpen={()=>go('/tool/'+t.id)}/>)}</div>:<div className="empty"><Search/><b>No tools found</b><p>Try another search term or category.</p><button onClick={()=>{setQ('');setCat('All Tools');setP({})}}>Clear filters</button></div>}</motion.div>}

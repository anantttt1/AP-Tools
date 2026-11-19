import{motion}from'framer-motion';import{useNavigate}from'react-router-dom';import{useState}from'react';import{Search,ArrowRight,ArrowUpRight,FileText,Image,Code2,Archive,ShieldCheck,Zap}from'lucide-react';import{tools}from'../data/tools';import ToolCard from'../components/ToolCard'
const cats=[['Files',Archive],['Images',Image],['Text',FileText],['Code',Code2],['Security',ShieldCheck],['Utilities',Zap]]
export default function Home(){const go=useNavigate();const[q,setQ]=useState('');const filtered=q?tools.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())||t.category.toLowerCase().includes(q.toLowerCase())).slice(0,8):tools.slice(0,8);return <motion.div className="stack" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
<div className="hero">
<label>AP TOOLS</label>
<h1>All your tools.<br/>One place.</h1>
<p>Browser-based utilities for files, images, text, code and more. Everything runs locally.</p>
<div className="hero-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools..."/><button onClick={()=>go('/tools?q='+encodeURIComponent(q))}>Search</button></div>
</div>
<section>
<div className="section-head"><h2>Popular tools</h2><button className="link" onClick={()=>go('/tools')}>View all <ArrowRight size={14}/></button></div>
<div className="tool-grid">{filtered.map(t=><ToolCard key={t.id} tool={t}/>)}</div>
</section>
<section>
<div className="section-head"><h2>Categories</h2></div>
<div className="cat-grid">{cats.map(([name,Icon])=><button key={name} className="cat-card" onClick={()=>go('/tools?cat='+encodeURIComponent(name))}><Icon size={22}/><span>{name}</span><ArrowUpRight size={14}/></button>)}</div>
</section>
</motion.div>}

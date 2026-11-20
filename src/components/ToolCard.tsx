import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import {Heart,ArrowUpRight,File,FileArchive,FileImage,Code2,Calculator,FileText,Palette,Shield,RefreshCw} from 'lucide-react'
import type{Tool}from'../data/tools'
import{useAppStore}from'../store/useAppStore'

const icons:Record<string,any>={archive:FileArchive,'file-pdf':FileText,image:FileImage,code:Code2,calculator:Calculator,palette:Palette,lock:Shield,'refresh-cw':RefreshCw}

export default function ToolCard({tool,onOpen}:{tool:Tool;onOpen?:()=>void}){
  const fav=useAppStore(s=>s.favorites.includes(tool.id))
  const toggle=useAppStore(s=>s.toggleFavorite)
  const Icon=icons[tool.icon]||File
  return <motion.article className="tool-card" whileHover={{y:-4}} transition={{duration:.18}}>
    <div className="tool-card-top">
      <div className="tool-icon"><Icon size={20}/></div>
      <button className={`icon-button ${fav?'is-favorite':''}`} onClick={()=>toggle(tool.id)} aria-label={fav?'Remove from favorites':'Add to favorites'}>
        <Heart size={17} fill={fav?'currentColor':'none'}/>
      </button>
    </div>
    <Link to={`/tool/${tool.id}`} className="tool-card-body" onClick={event=>{if(onOpen){event.preventDefault();onOpen()}}}>
      <b>{tool.name}</b>
      <span>{tool.description}</span>
      <em>Open tool <ArrowUpRight size={14}/></em>
    </Link>
  </motion.article>
}

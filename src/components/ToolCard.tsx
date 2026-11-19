import {motion} from 'framer-motion';import {Heart,ArrowUpRight,File,FileArchive,FileImage,Code2,Calculator,FileText,Palette,Shield,RefreshCw} from 'lucide-react';import type{Tool}from'../data/tools';import{useAppStore}from'../store/useAppStore'
const icons:Record<string,any>={archive:FileArchive,'file-search':File,'hard-drive':File,'fingerprint':Shield,files:File,image:FileImage,code:Code2,calculator:Calculator,'file-text':FileText,palette:Palette,shield:Shield,refresh:RefreshCw}
export default function ToolCard({tool}:{tool:Tool}){const fav=useAppStore(s=>s.favorites.includes(tool.id));const toggle=useAppStore(s=>s.toggleFavorite);const Icon=icons[tool.icon]||File;return <motion.a href={'/tool/'+tool.id} className="tool-card" whileHover={{y:-2}} onClick={e=>{if((e.target as HTMLElement).closest('button')){e.preventDefault();toggle(tool.id)}}}>
<div className="tool-card-icon"><Icon size={20}/></div>
<div className="tool-card-body"><b>{tool.name}</b><p>{tool.description}</p><span>{tool.category}</span></div>
<button className={fav?'fav on':'fav'} aria-label="Favorite"><Heart size={14} fill={fav?'currentColor':'none'}/></button>
<ArrowUpRight className="arrow" size={14}/>
</motion.a>}

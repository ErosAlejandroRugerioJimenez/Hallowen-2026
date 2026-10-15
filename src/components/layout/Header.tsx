import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Menu, Skull, X } from 'lucide-react'
import { navigation } from '../../data/event'
export default function Header() {
const [menuOpen, setMenuOpen] = useState(false)
const menuButton = useRef<HTMLButtonElement>(null)
const reduceMotion = useReducedMotion()
useEffect(() => {
 if(!menuOpen) return
 const close = (event: KeyboardEvent) => { if(event.key === 'Escape') {setMenuOpen(false);menuButton.current?.focus()} }
 window.addEventListener('keydown',close)
 return () => window.removeEventListener('keydown',close)
},[menuOpen])
useEffect(() => {
 const media=window.matchMedia('(min-width: 901px)')
 const close=()=>{if(media.matches)setMenuOpen(false)}
 media.addEventListener('change',close)
 return ()=>media.removeEventListener('change',close)
},[])
return (<header className="site-header">
      <a className="brand" href="#" aria-label="La Calle de las Brujas, inicio">
        <span className="brand-seal"><Skull size={27} strokeWidth={1} /></span>
        <span className="brand-name"><small>LA CALLE DE</small><b>LAS BRUJAS</b></span>
      </a>
      <nav className="navigation" aria-label="Navegación principal">
        {navigation.map(([label, href], i) => <m.a key={href} href={href} whileHover={reduceMotion ? undefined : {y:-2}}><span className="nav-numeral">{['I','II','III','IV','V'][i]}</span>{label}</m.a>)}
      </nav>
      <span className="edition"><span /> DÍA DE MUERTOS <b>2026</b></span>
      <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      <AnimatePresence>
        {menuOpen && <m.nav id="mobile-navigation" className="mobile-navigation" aria-label="Navegación móvil" initial={{opacity:0,y:reduceMotion ? 0:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduceMotion ? 0:-8}} transition={{duration:reduceMotion ? 0:.25}}>
          <Skull className="menu-skull" size={38} strokeWidth={.8}/><p className="eyebrow">ELIGE TU CAMINO</p>
          {navigation.map(([label, href], i) => <m.a key={href} href={href} initial={{opacity:0,x:reduceMotion ? 0:-10}} animate={{opacity:1,x:0}} transition={{delay:reduceMotion ? 0:i*.045}} onClick={() => setMenuOpen(false)}><span>{['I','II','III','IV','V'][i]}</span>{label}<ArrowUpRight size={17}/></m.a>)}
          <p className="menu-whisper">No todas las sombras están vacías.</p>
        </m.nav>}
      </AnimatePresence>
    </header>)
}
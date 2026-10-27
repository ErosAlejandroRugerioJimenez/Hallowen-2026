import { useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { SparkleIcon } from '@phosphor-icons/react'
import { supporters, type Supporter } from '../../data/supporters'

function SupporterArtwork({ supporter }: { supporter: Supporter }) {
  return supporter.logo ? <div className="supporter-logo" style={{ background: supporter.logoBackground }}>
    <img src={supporter.logo} alt="" width="640" height="640" loading="lazy" decoding="async" draggable={false}/>
  </div> : <div className="supporter-text">
    <span>PARTE DE NUESTRA HISTORIA</span>
    <span className="supporter-monogram" aria-hidden="true">{supporter.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()}</span>
    <strong>{supporter.name}</strong>
    <i aria-hidden="true"/>
    <span>GRACIAS POR SUMARTE</span>
  </div>
}

export default function Supporters() {
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const reducedMotion = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const autoScroll = useRef(AutoScroll({ speed: 0.8, playOnInit: false, stopOnInteraction: true, stopOnMouseEnter: false, stopOnFocusIn: false }))
  const [viewport, api] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start', breakpoints: { '(prefers-reduced-motion: reduce)': { active: false } } }, [autoScroll.current])

  useEffect(() => {
    const element = section.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(element)
    const visibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  useEffect(() => {
    if (!api) return
    const down = () => { clearTimeout(resumeTimer.current); setInteracting(true) }
    const up = () => { clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(() => setInteracting(false), 2000) }
    api.on('pointerDown', down).on('pointerUp', up)
    return () => { clearTimeout(resumeTimer.current); api.off('pointerDown', down).off('pointerUp', up) }
  }, [api])
  useEffect(() => {
    const scroll = api?.plugins().autoScroll
    if (!scroll) return
    const syncPlayback = () => {
      if (!paused && !interacting && visible && !hidden && !reducedMotion) scroll.play(0)
      else scroll.stop()
    }
    syncPlayback()
    api.on('reInit', syncPlayback)
    return () => { api.off('reInit', syncPlayback); scroll.stop() }
  }, [api, paused, interacting, visible, hidden, reducedMotion])
  function togglePlayback() {
    clearTimeout(resumeTimer.current)
    setInteracting(false)
    setPaused(value => !value)
  }

  if (!supporters.length) return null
  const ribbon = Array.from({ length: Math.max(1, Math.ceil(6 / supporters.length)) }, () => supporters).flat()

  return <section ref={section} id="apoyos" className="section supporters-section reveal" aria-labelledby="supporters-title">
    <div className="supporters-heading">
      <p className="eyebrow">EL APOYO QUE DA VIDA A NUESTRA CALLE</p>
      <h2 id="supporters-title">Juntos hacemos<br/><em>tradición.</em></h2>
      <p>Gracias a quienes se suman para hacer posible esta noche.</p>
      <span className="supporters-ornament" aria-hidden="true"><i/><SparkleIcon size={24} weight="duotone"/><i/></span>
    </div>
    <div ref={viewport} id="supporters-ribbon" className="supporters-ribbon" role="region" aria-label="Negocios que nos apoyan. Desliza para recorrerlos.">
      <div className="supporters-track">
        {[...ribbon, ...ribbon].map((supporter, index) => <div className="supporter-card" data-repeat={index >= supporters.length} key={supporter.name + index} aria-hidden={index >= supporters.length ? true : undefined}>
          <div className="supporter-artwork"><SupporterArtwork supporter={supporter}/></div>
          <span className="supporter-caption"><span>{supporter.name}</span><small>CON NUESTRA COMUNIDAD</small></span>
        </div>)}
      </div>
    </div>
    <div className="supporters-controls" role="group" aria-label="Controles de negocios">
      <button type="button" title={paused ? 'Reanudar' : 'Pausar'} aria-label={paused ? 'Reanudar carrusel de negocios' : 'Pausar carrusel de negocios'} aria-controls="supporters-ribbon" onClick={togglePlayback}>{paused ? <Play size={18}/> : <Pause size={18}/>}</button>
    </div>
  </section>
}

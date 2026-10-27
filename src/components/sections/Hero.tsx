import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ChevronsDown } from 'lucide-react'
import { CalendarDotsIcon, ClockIcon, MapPinIcon } from '@phosphor-icons/react'
import { event } from '../../data/event'
import Countdown from '../experience/Countdown'

export default function Hero() {
  const scene = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start start', 'end start'] })
  const streetY = useTransform(scrollYProgress, [0, 1], [0, 65])
  const figureY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const mistX = useTransform(scrollYProgress, [0, 1], [0, -45])
  return <section ref={scene} className="hero layered-hero" aria-labelledby="hero-title">
    <m.div className="horror-backdrop street-layer" style={{ y: reducedMotion ? 0 : streetY }}>
      <img src="/images/street-background.webp" srcSet="/images/street-background-mobile.webp 768w, /images/street-background.webp 1536w" sizes="100vw" decoding="async" alt="" width="1536" height="1024" fetchPriority="high" />
    </m.div>
    <m.div className="catrina-layer" style={{ y: reducedMotion ? 0 : figureY }}>
      <img src="/images/catrina-foreground.webp" srcSet="/images/catrina-foreground-mobile.webp 480w, /images/catrina-foreground.webp 800w" sizes="(max-width: 700px) 80vw, 55vw" decoding="async" alt="Catrina de luto frente a una calle con ofrendas y niebla" width="1024" height="1536" fetchPriority="high" />
    </m.div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="candle-light" aria-hidden="true" />
    <div className="film-grain" aria-hidden="true" />
    <m.div className="night-fog" aria-hidden="true" style={{ x: reducedMotion ? 0 : mistX }}><span /><span /></m.div>
    <div className="hero-copy">
      <p className="eyebrow"><span className="little-line" /> DÍA DE MUERTOS · {event.year}</p>
      <div className="hero-date-banner" aria-label={'Fecha del evento: ' + event.dateLabel + ', ' + event.timeLabel}>
        <span><CalendarDotsIcon size={22} weight="duotone" aria-hidden="true"/><strong>{event.shortDate}</strong></span>
        <span><ClockIcon size={22} weight="duotone" aria-hidden="true"/><strong>Cita: {event.timeLabel}</strong></span>
      </div>
      <h1 id="hero-title">La calle de<br /><em>las brujas.</em></h1>
      <p className="anniversary-message"><strong>24 años</strong><span>dando vida a nuestra tradición.</span></p>
      <p className="hero-description">Entre velas, catrinas y susurros, nuestra calle vuelve a cobrar vida. Ven con los tuyos a celebrar a quienes siempre nos acompañan.</p>
      <Countdown />
      <a className="hero-location-link" href="#ubicacion"><MapPinIcon size={22} weight="duotone" aria-hidden="true"/>Ver ubicación</a>
    </div>
    <span className="horror-whisper">NO TODAS LAS SOMBRAS ESTÁN VACÍAS</span>
    <a className="scroll-cue" href="#apoyos"><ChevronsDown size={22} strokeWidth={1.5}/> DESLIZA Y DESCUBRE MÁS</a>
  </section>
}







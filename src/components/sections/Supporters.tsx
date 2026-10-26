import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Pause, Play, Sparkles } from 'lucide-react'
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
  const track = useRef<HTMLDivElement>(null)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const gesture = useRef<{ id: number; x: number; y: number; time: number; horizontal: boolean } | null>(null)
  useEffect(() => () => clearTimeout(resumeTimer.current), [])

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return
    const animation = track.current?.getAnimations()[0]
    if (!animation) return
    clearTimeout(resumeTimer.current)
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: Number(animation.currentTime ?? 0), horizontal: false }
    setInteracting(true)
  }
  function drag(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current
    if (!start || start.id !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (!start.horizontal) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { endDrag(); return }
      if (Math.abs(dx) < 8) return
      start.horizontal = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const animation = track.current?.getAnimations()[0]
    const width = track.current?.firstElementChild?.getBoundingClientRect().width ?? 0
    const duration = Number(animation?.effect?.getTiming().duration)
    if (!animation || !width || !Number.isFinite(duration)) return
    event.preventDefault()
    const time = start.time - dx / width * duration
    animation.currentTime = ((time % duration) + duration) % duration
  }
  function endDrag() {
    if (!gesture.current) return
    gesture.current = null
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setInteracting(false), 30)
  }
  function togglePlayback() {
    clearTimeout(resumeTimer.current)
    gesture.current = null
    setInteracting(false)
    setPaused(value => !value)
  }

  if (!supporters.length) return null
  const ribbon = Array.from({ length: Math.max(1, Math.ceil(6 / supporters.length)) }, () => supporters).flat()

  return <section id="apoyos" className="section supporters-section reveal" aria-labelledby="supporters-title">
    <div className="supporters-heading">
      <p className="eyebrow">EL APOYO QUE DA VIDA A NUESTRA CALLE</p>
      <h2 id="supporters-title">Juntos hacemos<br/><em>tradición.</em></h2>
      <p>Gracias a quienes se suman para hacer posible esta noche.</p>
      <span className="supporters-ornament" aria-hidden="true"><i/><Sparkles size={19}/><i/></span>
    </div>
    <div id="supporters-ribbon" className="supporters-ribbon" role="region" aria-label="Negocios que nos apoyan. Desliza para recorrerlos." onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
<div ref={track} className="supporters-track" data-paused={paused || interacting} style={{ animationDuration: '40s' }}>
          {[0, 1].map(copy => <div className="supporters-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {ribbon.map((supporter, index) => <div className="supporter-card" data-repeat={index >= supporters.length} key={supporter.name + index} aria-hidden={index >= supporters.length ? true : undefined}>
            <div className="supporter-artwork"><SupporterArtwork supporter={supporter}/></div>
            <span className="supporter-caption"><span>{supporter.name}</span><small>CON NUESTRA COMUNIDAD</small></span>
          </div>)}
        </div>)}
      </div>
    </div>
    <div className="supporters-controls" role="group" aria-label="Controles de negocios">
      <button type="button" title={paused ? 'Reanudar' : 'Pausar'} aria-label={paused ? 'Reanudar carrusel de negocios' : 'Pausar carrusel de negocios'} aria-controls="supporters-ribbon" onClick={togglePlayback}>{paused ? <Play size={18}/> : <Pause size={18}/>}</button>
    </div>
  </section>
}

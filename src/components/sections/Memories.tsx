import { useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, Camera, Expand, Pause, Play, X } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { memories } from '../../data/memories'

export default function Memories() {
  const reducedMotion = useReducedMotion()
  const [emblaRef, api] = useEmblaCarousel({ loop: memories.length > 1, align: 'center', duration: reducedMotion ? 0 : 35 })
  const [active, setActive] = useState(0)
  const [nearby, setNearby] = useState(false)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set())
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)
  const section = useRef<HTMLElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const multiple = memories.length > 1

  useEffect(() => {
    if (!api) return
    const select = () => setActive(api.selectedScrollSnap())
    const startDrag = () => setDragging(true)
    const endDrag = () => setDragging(false)
    select()
    api.on('select', select).on('reInit', select).on('pointerDown', startDrag).on('pointerUp', endDrag)
    return () => { api.off('select', select).off('reInit', select).off('pointerDown', startDrag).off('pointerUp', endDrag) }
  }, [api])

  useEffect(() => {
    const element = section.current
    if (!element) return
    if (!('IntersectionObserver' in window)) { setNearby(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '400px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!nearby || !memories.length) return
    setLoaded(previous => {
      const next = new Set(previous)
      for (const offset of [-1, 0, 1, 2]) next.add((active + offset + memories.length) % memories.length)
      return next.size === previous.size ? previous : next
    })
  }, [active, nearby])

  useEffect(() => {
    const element = section.current
    if (!api || !element || !multiple || paused || dragging || reducedMotion || expanded !== null || !('IntersectionObserver' in window)) return
    let visible = false
    let timer: number | undefined
    const stop = () => { window.clearTimeout(timer); timer = undefined }
    const schedule = () => {
      stop()
      if (visible && !document.hidden) timer = window.setTimeout(() => api.scrollNext(), 2000)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      schedule()
    }, { threshold: 0.15 })
    observer.observe(element)
    api.on('settle', schedule)
    document.addEventListener('visibilitychange', schedule)
    return () => {
      stop()
      observer.disconnect()
      api.off('settle', schedule)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [api, multiple, paused, dragging, reducedMotion, expanded])
  useEffect(() => {
    if (expanded !== null) dialog.current?.showModal()
  }, [expanded])

  function navigate(direction: number) {
    setPaused(true)
    if (direction > 0) api?.scrollNext(Boolean(reducedMotion))
    else api?.scrollPrev(Boolean(reducedMotion))
  }

  return <section ref={section} id="recuerdos" className="section memories-section reveal" aria-labelledby="memories-title">
    <div className="memories-heading">
      <div><p className="eyebrow">EL ÁLBUM DE NUESTRA CALLE</p>
        <h2 id="memories-title">24 años.<br/><em>Incontables recuerdos.</em></h2>
      </div>
      <p>Los disfraces cambian.<br/>La tradición sigue viva.<span>Fotografías de nuestra comunidad</span></p>
    </div>
    {memories.length === 0 ? <div className="memories-empty">
      <Camera size={34} strokeWidth={1} aria-hidden="true"/>
      <p>Pronto compartiremos los momentos que han hecho historia en nuestra calle.</p>
    </div> : <div className="memories-carousel" role="region" aria-roledescription="carrusel" aria-label="Recuerdos de otras ediciones">
      <div className="album-label" aria-hidden="true"><span>CALLE ALLENDE</span><span>ARCHIVO DE RECUERDOS / {String(memories.length).padStart(2, '0')}</span></div>
      <div ref={emblaRef} className="memories-viewport" tabIndex={0}
        aria-label="Fotografías. Desliza o usa las flechas del teclado."
        onFocus={event => { if (event.target.matches(':focus-visible')) setPaused(true) }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            navigate(event.key === 'ArrowRight' ? 1 : -1)
          }
        }}>
        <div className="memories-track">
          {memories.map((photo, index) => <div className={'memory-slide' + (index === active ? ' is-active' : '')}
            key={photo.src + index} role="group" aria-roledescription="diapositiva" aria-label={(index + 1) + ' de ' + memories.length}>
            <figure className="memory-print">
              <div className="memory-photo">
                
                {loaded.has(index) && <img className="memory-original" src={photo.src}
                  srcSet={photo.smallWidth < photo.width ? photo.smallSrc + ' ' + photo.smallWidth + 'w, ' + photo.src + ' ' + photo.width + 'w' : undefined}
                  sizes="(max-width: 700px) 72vw, (max-width: 1100px) 65vw, 700px"
                  alt={photo.alt} width={photo.width} height={photo.height} loading="eager" decoding="async" draggable={false}/>} 
                <button className="memory-expand" type="button" tabIndex={index === active ? 0 : -1}
                  aria-label={'Ampliar fotografía ' + (index + 1)}
                  onClick={() => { setPaused(true); setExpanded(index) }}><Expand size={18}/></button>
              </div>
              <figcaption><span>{photo.year ? 'Edición ' + photo.year : 'Nuestra gente, nuestra historia'}</span><b>{String(index + 1).padStart(2, '0')}</b></figcaption>
            </figure>
          </div>)}
        </div>
      </div>
      <div className="memories-controls">
        <span className="memory-count" aria-live={paused || reducedMotion ? 'polite' : 'off'}><b>{String(active + 1).padStart(2, '0')}</b><span>/ {String(memories.length).padStart(2, '0')}</span></span>
        {multiple && <div className="memory-dots" aria-label="Elegir fotografía">
          {memories.map((photo, index) => <button key={photo.src + index} type="button" className={index === active ? 'is-active' : ''}
            aria-label={'Ver fotografía ' + (index + 1)} aria-current={index === active ? 'true' : undefined}
            onClick={() => { setPaused(true); api?.scrollTo(index, Boolean(reducedMotion)) }}><span/></button>)}
        </div>}
        {multiple && <div className="memory-buttons">
          <button type="button" aria-label="Foto anterior" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
          {!reducedMotion && <button type="button" aria-label={paused ? 'Reproducir carrusel' : 'Pausar carrusel'} title={paused ? 'Reanudar cambio automático de fotos' : 'Pausar cambio automático de fotos'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}
          <button type="button" aria-label="Foto siguiente" onClick={() => navigate(1)}><ArrowRight size={20}/></button>
        </div>}
      </div>
      <p className="memory-hint">Desliza y vuelve a vivir la tradición.</p>
    </div>}
    <dialog ref={dialog} className="memory-lightbox" onClose={() => setExpanded(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }} aria-label="Fotografía ampliada">
      <button type="button" className="memory-lightbox-close" autoFocus aria-label="Cerrar fotografía" onClick={() => dialog.current?.close()}><X size={24}/></button>
      {expanded !== null && <img src={memories[expanded].src} alt={memories[expanded].alt}/>}
    </dialog>
  </section>
}






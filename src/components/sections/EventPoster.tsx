import { useRef, useState } from 'react'
import { Download, Share2, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { event } from '../../data/event'

export default function EventPoster() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const posterDialog = useRef<HTMLDialogElement>(null)
  function openPoster() {
    posterDialog.current?.showModal()
  }
  async function share() {
    if (busy) return
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/images/cartel-concursos-2026.jpg')
      if (!response.ok) throw new Error('Cartel no disponible')
      const file = new File([await response.blob()], 'calle-de-las-brujas-2026.jpg', { type: 'image/jpeg' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
      } else {
        openPoster()
        setMessage('Guarda el cartel en Fotos y compártelo desde WhatsApp.')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('Puedes usar Descargar cartel para guardarlo y compartirlo.')
    } finally {
      setBusy(false)
    }
  }
  return <section id="cartel" className="section poster-section reveal" aria-labelledby="poster-title">
    <button type="button" className="poster-preview" onClick={openPoster} aria-label="Ampliar cartel">
      <img src="/images/cartel-concursos-2026.webp" alt="Cartel a dos tintas, 24 años de tradición: Calle de las Brujas 2026, Día de Muertos, 2 de noviembre, 5:30 p. m., Calle Allende" width="1024" height="1536" loading="lazy" decoding="async"/>
    </button>
    <div className="poster-copy"><p className="eyebrow">LA INVITACIÓN ESTÁ HECHA</p><h2 id="poster-title">La invitación<br/><em>es para todos.</em></h2><p>Guárdalo y compártelo con los tuyos.</p>
      <p className="poster-date">{event.dateLabel} · Cita: {event.timeLabel}</p>
      <div className="poster-actions">
        <a className="primary-link" href="/images/cartel-concursos-2026.jpg" download="calle-de-las-brujas-2026.jpg"><Download size={18}/> Descargar cartel</a>
        <button type="button" className="poster-share" disabled={busy} onClick={() => void share()}><Share2 size={18}/>{busy ? 'Preparando…' : 'Compartir cartel'}</button>
      </div>
      <p className="poster-message" role="status">{message}</p>
    </div>
    {createPortal(<dialog ref={posterDialog} className="poster-save-dialog" aria-labelledby="poster-save-title" aria-describedby="poster-save-help" onClick={click => { if (click.target === click.currentTarget) posterDialog.current?.close() }}>
      <div className="poster-save-header">
        <h3 id="poster-save-title">La invitación</h3>
        <button type="button" autoFocus aria-label="Cerrar cartel" onClick={() => posterDialog.current?.close()}><X size={24}/></button>
      </div>
      <p id="poster-save-help">Mantén presionada la imagen y elige «Guardar en Fotos» o «Añadir a Fotos».</p>
      <img src="/images/cartel-concursos-2026.jpg" alt="Invitación de La Calle de las Brujas 2026, 2 de noviembre a las 5:30 p. m." width="1024" height="1536"/>
    </dialog>, document.body)}
  </section>
}







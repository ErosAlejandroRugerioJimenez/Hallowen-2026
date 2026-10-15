import { useRef, useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import { event } from '../../data/event'

export default function EventPoster() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const downloadLink = useRef<HTMLAnchorElement>(null)
  async function share() {
    if (busy) return
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/images/cartel-concursos-2026.jpg')
      if (!response.ok) throw new Error('Cartel no disponible')
      const file = new File([await response.blob()], 'calle-de-las-brujas-2026.jpg', { type: 'image/jpeg' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: event.name + ' 2026',
          text: '24 años de tradición · Día de Muertos · ' + event.shortDate + ' · Cita: ' + event.timeLabel + ' · ' + event.location.street,
        })
      } else {
        downloadLink.current?.click()
        setMessage('Cartel descargado. Puedes adjuntarlo en WhatsApp.')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('Puedes usar Descargar cartel para guardarlo y compartirlo.')
    } finally {
      setBusy(false)
    }
  }
  return <section id="cartel" className="section poster-section reveal" aria-labelledby="poster-title">
    <a className="poster-preview" href="/images/cartel-concursos-2026.jpg" target="_blank" rel="noopener noreferrer" aria-label="Abrir cartel en tamaño completo">
      <img src="/images/cartel-concursos-2026.webp" alt="Cartel a dos tintas, 24 años de tradición: Calle de las Brujas 2026, Día de Muertos, 2 de noviembre, 5:30 p. m., Calle Allende" width="1024" height="1536" loading="lazy" decoding="async"/>
    </a>
    <div className="poster-copy"><p className="eyebrow">QUE LA INVITACIÓN LLEGUE A TODOS</p><h2 id="poster-title">Comparte<br/><em>esta noche.</em></h2><p>Guarda el cartel y pásalo a tus vecinos, familia y amigos. Nos vemos en la Calle de las Brujas.</p>
      <div className="poster-actions">
        <a ref={downloadLink} className="primary-link" href="/images/cartel-concursos-2026.jpg" download="calle-de-las-brujas-2026.jpg"><Download size={18}/> Descargar cartel</a>
        <button type="button" className="poster-share" disabled={busy} onClick={() => void share()}><Share2 size={18}/>{busy ? 'Preparando…' : 'Compartir cartel'}</button>
      </div>
      <p className="poster-message" role="status">{message}</p>
    </div>
  </section>
}





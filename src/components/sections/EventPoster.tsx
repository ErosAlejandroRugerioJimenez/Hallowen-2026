import { useRef, useState } from 'react'
import { Download, Share2, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { event } from '../../data/event'

const posters = [
  {
    label: 'Invitación',
    preview: '/images/cartel-concursos-2026.webp',
    image: '/images/cartel-concursos-2026.jpg',
    filename: 'calle-de-las-brujas-2026.jpg',
    alt: 'Invitación: 24 años de tradición, Calle de las Brujas 2026. Día de Muertos, 2 de noviembre, cita a las 5:30 p. m., Calle Allende.',
    width: 1024, height: 1536,
  },
  {
    label: 'Show y desfile',
    preview: '/images/cartel-show-desfile-2026.webp',
    image: '/images/cartel-show-desfile-2026.jpg',
    filename: 'calle-de-las-brujas-show-desfile-2026.jpg',
    alt: 'Cartel del payaso Sponch Biker en San Francisco Tetlanohcan. Desfile a las 6:00 p. m. y show a las 6:30 p. m.',
    width: 853, height: 1280,
  },
] as const

export default function EventPoster() {
  const [selected, setSelected] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const posterDialog = useRef<HTMLDialogElement>(null)
  const poster = posters[selected]
  function openPoster() { posterDialog.current?.showModal() }

  async function share() {
    if (busy) return
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch(poster.image)
      if (!response.ok) throw new Error('Cartel no disponible')
      const file = new File([await response.blob()], poster.filename, { type: 'image/jpeg' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
      } else {
        openPoster()
        setMessage('Guarda el cartel en Fotos y compártelo desde WhatsApp.')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('Puedes usar Descargar cartel para guardarlo y compartirlo.')
    } finally { setBusy(false) }
  }

  return <section id="cartel" className="section poster-section reveal" aria-labelledby="poster-title">
    <div className="poster-gallery">
      <div className="poster-selector" role="group" aria-label="Elegir cartel">
        {posters.map((item, index) => <button key={item.image} type="button" aria-pressed={selected === index} aria-controls="selected-poster" disabled={busy} onClick={() => { setSelected(index); setMessage('') }}>{item.label}</button>)}
      </div>
      <button id="selected-poster" type="button" className="poster-preview" onClick={openPoster} aria-label={'Ampliar cartel: ' + poster.label}>
        <img key={poster.preview} src={poster.preview} alt={poster.alt} width={poster.width} height={poster.height} loading="lazy" decoding="async"/>
      </button>
    </div>
    <div className="poster-copy">
      <p className="eyebrow">LA INVITACIÓN ESTÁ HECHA</p>
      <h2 id="poster-title">La invitación<br/><em>es para todos.</em></h2>
      <p>Elige tu cartel, guárdalo y compártelo con los tuyos.</p>
      <p className="poster-date">{event.dateLabel} · Cita: {event.timeLabel}</p>
      <dl className="poster-times">
        <div><dt>Desfile</dt><dd>6:00 p. m.</dd></div>
        <div><dt>Show de Sponch Biker</dt><dd>6:30 p. m.</dd></div>
      </dl>
      <div className="poster-actions">
        <a className="primary-link" href={poster.image} download={poster.filename}><Download size={18}/> Descargar cartel</a>
        <button type="button" className="poster-share" disabled={busy} onClick={() => void share()}><Share2 size={18}/>{busy ? 'Preparando…' : 'Compartir cartel'}</button>
      </div>
      <p className="poster-message" role="status">{message}</p>
    </div>
    {createPortal(<dialog ref={posterDialog} className="poster-save-dialog" aria-labelledby="poster-save-title" aria-describedby="poster-save-help" onClick={click => { if (click.target === click.currentTarget) posterDialog.current?.close() }}>
      <div className="poster-save-header">
        <h3 id="poster-save-title">{poster.label}</h3>
        <button type="button" autoFocus aria-label="Cerrar cartel" onClick={() => posterDialog.current?.close()}><X size={24}/></button>
      </div>
      <p id="poster-save-help">Mantén presionada la imagen y elige «Guardar en Fotos» o «Añadir a Fotos».</p>
      <img src={poster.image} alt={poster.alt} width={poster.width} height={poster.height}/>
    </dialog>, document.body)}
  </section>
}

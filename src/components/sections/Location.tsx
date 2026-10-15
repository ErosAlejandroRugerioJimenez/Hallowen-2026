import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import { event } from '../../data/event'

export default function Location() {
  return <section id="ubicacion" className="section location-section reveal" aria-labelledby="location-title">
    <div className="location-copy">
      <p className="eyebrow">NOS VEMOS EN LA CALLE</p>
      <h2 id="location-title">Aquí empieza<br/><em>nuestra tradición.</em></h2>
      <p className="location-address">{event.location.address}</p>
      <div className="location-details">
        <span><CalendarDays size={17} strokeWidth={1}/>{event.dateLabel}</span>
        <span><Clock3 size={17} strokeWidth={1}/>Cita: {event.timeLabel}</span>
      </div>
      <a className="primary-link" href={event.location.directionsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar <ArrowUpRight size={17}/></a>
    </div>
    <div className="map-frame">
      <iframe src={event.location.embedUrl} title="Mapa en 2D del punto de encuentro" width="600" height="400" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>
      <a href={event.location.mapUrl} target="_blank" rel="noopener noreferrer">Abrir en Google Maps <ArrowUpRight size={13}/></a>
    </div>
  </section>
}



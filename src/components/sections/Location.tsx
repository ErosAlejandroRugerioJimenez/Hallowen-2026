import { ArrowUpRight } from 'lucide-react'
import { CalendarDotsIcon, ClockIcon } from '@phosphor-icons/react'
import { trackEvent } from '../../utils/analytics'
import { event } from '../../data/event'

export default function Location() {
  return <section id="ubicacion" className="section location-section reveal" aria-labelledby="location-title">
    <div className="location-copy">
      <p className="eyebrow">NOS VEMOS EN LA CALLE</p>
      <h2 id="location-title">Aquí empieza<br/><em>nuestra tradición.</em></h2>
      <p className="location-address"><strong>{event.location.addressLine}</strong><span>{event.location.addressArea}</span></p>
      <div className="location-details">
        <span><CalendarDotsIcon size={22} weight="duotone" aria-hidden="true"/>{event.dateLabel}</span>
        <span><ClockIcon size={22} weight="duotone" aria-hidden="true"/>Cita: {event.timeLabel}</span>
      </div>
      <a className="primary-link" href={event.location.directionsUrl} onClick={() => trackEvent('como-llegar')} target="_blank" rel="noopener noreferrer">Cómo llegar <ArrowUpRight size={17}/></a>
    </div>
    <div className="map-frame">
      <iframe src={event.location.embedUrl} title="Mapa en 2D del punto de encuentro" width="600" height="400" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>
      <a href={event.location.mapUrl} onClick={() => trackEvent('abrir-mapa')} target="_blank" rel="noopener noreferrer">Abrir en Google Maps <ArrowUpRight size={17} aria-hidden="true"/></a>
    </div>
  </section>
}




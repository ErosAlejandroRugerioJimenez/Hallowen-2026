import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { event } from '../../data/event'

export default function Footer() {
  return <footer className="event-footer">
    <div className="footer-main">
      <div className="footer-identity">
        <p className="footer-kicker">DÍA DE MUERTOS · {event.year}</p>
        <a className="footer-brand" href="#contenido">La Calle de<br/><em>las Brujas.</em></a>
        <p className="footer-message">24 años de historias.<br/>Una calle que nos reúne.</p>
      </div>
      <div className="footer-meeting">
        <h2>Nos vemos en la calle</h2>
        <p>{event.shortDate} · {event.timeLabel}</p>
        <p>{event.location.shortAddress}</p>
        <a href="#ubicacion">Encuentra el punto de reunión <ArrowUpRight size={17}/></a>
      </div>
      <nav className="footer-links" aria-label="Enlaces del pie de página">
        <a href="#recuerdos">Nuestros recuerdos <ArrowUpRight size={16}/></a>
        <a href="#participa">Sé parte de la tradición <ArrowUpRight size={16}/></a>
        <a href="#comite">Comité 2026 <ArrowUpRight size={16}/></a>
      </nav>
    </div>
    <div className="footer-bottom">
      <small>© 2026 · Desarrollado por Biglat Technologies.</small>
      <span>Hecho de comunidad y tradición.</span>
      <a className="footer-back-top" href="#contenido">Volver arriba <ArrowUp size={18} strokeWidth={1.5}/></a>
    </div>
  </footer>
}



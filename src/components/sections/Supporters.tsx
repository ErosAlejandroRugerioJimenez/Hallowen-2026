import { Sparkles } from 'lucide-react'
import { supporters } from '../../data/supporters'

export default function Supporters() {
  const names = supporters.map(name => name.trim()).filter(Boolean)
  if (!names.length) return null
  // Equal halves with sufficient width prevent gaps on wide screens.
  const ribbon = Array.from({ length: Math.max(1, Math.ceil(8 / names.length)) }, () => names).flat()
  return <section id="apoyos" className="section supporters-section reveal" aria-labelledby="supporters-title">
    <div className="supporters-heading">
      <p className="eyebrow">NEGOCIOS QUE SE SUMAN A NUESTRA HISTORIA</p>
      <h2 id="supporters-title">Gracias por hacer posible<br/><em>esta tradición.</em></h2>
      <p>A los negocios que se sumaron con su apoyo,Vecinos y Amigos,gracias por ser parte de esta noche.</p>
    </div>
    <div className="supporters-ribbon">
      <div className="supporters-track" aria-hidden="true" style={{ animationDuration: Math.max(80, ribbon.length * 10) + 's' }}>
        {[0, 1].map(copy => <div className="supporters-group" key={copy}>
          {ribbon.map((name, index) => <span className="supporter-name" key={index}>
            <Sparkles size={18} strokeWidth={1} />
            <span>{name}</span>
          </span>)}
        </div>)}
      </div>
      <ul className="sr-only" aria-label="Negocios que nos apoyan">
        {names.map((name, index) => <li key={index}>{name}</li>)}
      </ul>
    </div>
    <div className="supporters-bottom">
      <p>Su apoyo también deja huella en nuestra calle.</p>
    </div>
  </section>
}



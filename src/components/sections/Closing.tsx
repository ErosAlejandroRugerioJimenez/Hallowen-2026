import { ArrowUpRight } from 'lucide-react'
import { event } from '../../data/event'

export default function Closing() {
 return (
<section className="closing-section reveal"><p className="eyebrow">LA CALLE DE LAS BRUJAS</p><h2>Cuando la noche caiga,<br /><em>nos vemos en la calle.</em></h2><p>Día de Muertos {event.year} · {event.shortDate} · {event.timeLabel}</p><a href="#contenido" className="back-top">Volver al inicio <ArrowUpRight size={16} /></a></section>
)
}

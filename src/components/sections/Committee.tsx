import PassingShadow from '../decorations/PassingShadow'
import { UsersRound } from 'lucide-react'
import { committee } from '../../data/event'

export default function Committee() {
  return <section id="comite" className="section committee-section reveal" aria-labelledby="committee-title">
    <div className="committee-icon"><UsersRound size={35} strokeWidth={1.1}/></div>
    <p className="eyebrow">DE VECINOS, PARA TODOS</p>
    <h2 id="committee-title">Comité <em>2026</em></h2>
    <p>Detrás de esta celebración hay una comunidad que la hace posible. Conoce a quienes organizan y preparan esta edición para que nuestra tradición continúe.</p>
    <ul className="committee-members">
      {committee.map(member => <li key={member.role}>
        <span className="committee-role">{member.role}</span>
        <h3>{member.name}</h3>
      </li>)}
    </ul>
    <PassingShadow/>
  </section>
}

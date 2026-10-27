import PassingShadow from '../decorations/PassingShadow'
import { UsersThreeIcon } from '@phosphor-icons/react'
import '../../styles/section-emblems.css'
import { committee } from '../../data/event'

export default function Committee() {
  return <section id="comite" className="section committee-section reveal" aria-labelledby="committee-title">
    <div className="committee-icon section-emblem committee-emblem" aria-hidden="true"><UsersThreeIcon size={44} weight="duotone" /></div>
    <p className="eyebrow">DE VECINOS, PARA TODOS</p>
    <h2 id="committee-title">Comité <em>2026</em></h2>
    <p>Vecinos que organizan esta edición para que nuestra tradición siga viva.</p>
    <ul className="committee-members">
      {committee.map(member => <li key={member.role}>
        <span className="committee-role">{member.role}</span>
        <h3>{member.name}</h3>
      </li>)}
    </ul>
    <PassingShadow/>
  </section>
}


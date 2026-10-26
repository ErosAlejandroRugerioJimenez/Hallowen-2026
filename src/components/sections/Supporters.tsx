import { useState } from 'react'
import { Pause, Play, Sparkles } from 'lucide-react'
import { supporters, type Supporter } from '../../data/supporters'

function SupporterArtwork({ supporter }: { supporter: Supporter }) {
  return supporter.logo ? <div className="supporter-logo" style={{ background: supporter.logoBackground }}>
    <img src={supporter.logo} alt="" width="640" height="640" loading="lazy" decoding="async" draggable={false}/>
  </div> : <div className="supporter-text">
    <span>PARTE DE NUESTRA HISTORIA</span>
    <span className="supporter-monogram" aria-hidden="true">{supporter.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()}</span>
    <strong>{supporter.name}</strong>
    <i aria-hidden="true"/>
    <span>GRACIAS POR SUMARTE</span>
  </div>
}

export default function Supporters() {
  const [paused, setPaused] = useState(false)

  if (!supporters.length) return null
  const ribbon = Array.from({ length: Math.max(1, Math.ceil(6 / supporters.length)) }, () => supporters).flat()

  return <section id="apoyos" className="section supporters-section reveal" aria-labelledby="supporters-title">
    <div className="supporters-heading">
      <p className="eyebrow">EL APOYO QUE DA VIDA A NUESTRA CALLE</p>
      <h2 id="supporters-title">Juntos hacemos<br/><em>tradición.</em></h2>
      <p>Gracias a quienes se suman para hacer posible esta noche.</p>
      <span className="supporters-ornament" aria-hidden="true"><i/><Sparkles size={19}/><i/></span>
    </div>
    <div id="supporters-ribbon" className="supporters-ribbon" role="region" aria-label="Negocios que nos apoyan">
<div className="supporters-track" data-paused={paused} style={{ animationDuration: '40s' }}>
          {[0, 1].map(copy => <div className="supporters-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {ribbon.map((supporter, index) => <div className="supporter-card" data-repeat={index >= supporters.length} key={supporter.name + index} aria-hidden={index >= supporters.length ? true : undefined}>
            <div className="supporter-artwork"><SupporterArtwork supporter={supporter}/></div>
            <span className="supporter-caption"><span>{supporter.name}</span><small>CON NUESTRA COMUNIDAD</small></span>
          </div>)}
        </div>)}
      </div>
    </div>
    <div className="supporters-controls" role="group" aria-label="Controles de negocios">
      <button type="button" title={paused ? 'Reanudar' : 'Pausar'} aria-label={paused ? 'Reanudar carrusel de negocios' : 'Pausar carrusel de negocios'} aria-controls="supporters-ribbon" onClick={() => setPaused(value => !value)}>{paused ? <Play size={18}/> : <Pause size={18}/>}</button>
    </div>
  </section>
}

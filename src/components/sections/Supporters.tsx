import { supporters } from '../../data/supporters'

export default function Supporters() {
  if (!supporters.length) return null
  const ribbon = Array.from({ length: Math.max(1, Math.ceil(6 / supporters.length)) }, () => supporters).flat()

  return <section id="apoyos" className="section supporters-section reveal" aria-labelledby="supporters-title">
    <div className="supporters-heading">
      <p className="eyebrow">EL APOYO QUE DA VIDA A NUESTRA CALLE</p>
      <h2 id="supporters-title">Esta tradición también<br/><em>lleva su nombre.</em></h2>
      <p>Gracias a los negocios, vecinos y amigos que hacen posible esta noche.</p>
    </div>
    <div className="supporters-ribbon" role="region" aria-label="Negocios que nos apoyan">
      <div className="supporters-track" aria-hidden="true" style={{ animationDuration: Math.max(80, ribbon.length * 10) + 's' }}>
        {[0, 1].map(copy => <div className="supporters-group" key={copy}>
          {ribbon.map((supporter, index) => <figure className="supporter-card" data-repeat={index >= supporters.length} key={supporter.name + index}>
            {supporter.logo ? <div className="supporter-logo" style={{ background: supporter.logoBackground }}>
              <img src={supporter.logo} alt="" width="640" height="640" loading="lazy" decoding="async" draggable={false}/>
            </div> : <div className="supporter-text">
              <span>NEGOCIO QUE NOS APOYA</span>
              <strong>{supporter.name}</strong>
              <i aria-hidden="true"/>
              <span>PARTE DE NUESTRA TRADICIÓN</span>
            </div>}
            <figcaption>{supporter.name}</figcaption>
          </figure>)}
        </div>)}
      </div>
      <ul className="sr-only" aria-label="Lista de negocios que nos apoyan">
        {supporters.map(supporter => <li key={supporter.name}>{supporter.name}</li>)}
      </ul>
    </div>
  </section>
}

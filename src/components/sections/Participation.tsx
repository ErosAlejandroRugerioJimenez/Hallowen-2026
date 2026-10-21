import { PaperGarland } from '../decorations/Decorations'

export default function Participation() {
  return <>
    <div className="garland-divider"><PaperGarland compact/></div>
    <section id="participa" className="section invitation-section community-invitation reveal" aria-labelledby="participation-title">
      <div className="participation-heading">
        <p className="eyebrow">VECINOS, FAMILIAS Y NEGOCIOS</p>
        <h2 id="participation-title">La próxima historia<br/><em>la hacemos contigo.</em></h2>
      </div>
      <figure className="participation-photo decorated-car-photo">
        <img src="/images/carro-decorado-1200.webp"
          srcSet="/images/carro-decorado-640.webp 640w, /images/carro-decorado-1200.webp 1200w"
          sizes="(max-width: 800px) 90vw, 550px" width="1200" height="1500"
          alt="Carro rojo decorado con guirnaldas de flores naranjas y moradas durante un desfile de Día de Muertos." loading="lazy" decoding="async"/>
        <figcaption>Tu carro también puede ser parte de la tradición.</figcaption>
      </figure>
      <div className="participation-copy">
        <div className="participation-block">
          <h3>Ven con los tuyos.</h3>
          <p>Decora tu carro o moto, o ven a pie con tu disfraz. ¡Súmate al desfile!</p>
        </div>
        <div className="participation-block participation-business">
          <h3>¿Tienes un negocio?</h3>
          <p>Participa con tu equipo y da a conocer tu negocio con un vehículo decorado.</p>
        </div>
      </div>
    </section>
  </>
}





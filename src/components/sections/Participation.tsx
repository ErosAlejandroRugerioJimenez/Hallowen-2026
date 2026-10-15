import { PaperGarland } from '../decorations/Decorations'

export default function Participation() {
  return <>
    <div className="garland-divider"><PaperGarland compact/></div>
    <section id="participa" className="section invitation-section community-invitation reveal" aria-labelledby="participation-title">
      <div className="participation-heading">
        <p className="eyebrow">VECINOS, FAMILIAS Y NEGOCIOS</p>
        <h2 id="participation-title">La próxima historia<br/><em>la hacemos contigo.</em></h2>
      </div>
      <figure className="participation-photo">
        <img src="/images/desfile-participa-1140.webp"
          srcSet="/images/desfile-participa-640.webp 640w, /images/desfile-participa-1140.webp 1140w"
          sizes="(max-width: 800px) 90vw, 550px" width="1140" height="854"
          alt="Figuras de calaveras y un caballo esquelético en un desfile de Día de Muertos." loading="lazy" decoding="async"/>
        <figcaption>Dale vida a la tradición. Súmate al desfile.</figcaption>
      </figure>
      <div className="participation-copy">
        <div className="participation-block">
          <h3>Ven como quieras.<br/>Pero ven con los tuyos.</h3>
          <p>Trae tu carro o moto decorados, o súmate a pie con tu mejor disfraz. Invita a tu familia y amigos a celebrar estos 24 años de tradición.</p>
        </div>
        <div className="participation-block participation-business">
          <h3>Tu negocio también es parte.</h3>
          <p>Participa con tu equipo, decora tu vehículo con temática de Día de Muertos y da a conocer tu negocio durante el desfile.</p>
        </div>
        <span className="invitation-sign">Tú también haces que nuestra calle cobre vida.</span>
      </div>
    </section>
  </>
}


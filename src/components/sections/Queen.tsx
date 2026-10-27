import { CrownIcon } from '@phosphor-icons/react'
import '../../styles/section-emblems.css'
import '../../styles/queen.css'

export default function Queen() {
  return <section id="reina" className="section queen-section reveal" aria-labelledby="queen-title">
    <div className="queen-copy">
      <span className="section-emblem queen-emblem" aria-hidden="true"><CrownIcon size={44} weight="duotone" /></span>
      <p className="eyebrow">LA CALLE DE LAS BRUJAS</p>
      <h2 id="queen-title">Nuestra reina <em>2026</em></h2>
      <p>Este año, nuestra tradición también tiene reina. Celebremos juntos una noche llena de historia y comunidad.</p>
      <span className="queen-signature">24 años de tradición. Una noche para compartir.</span>
    </div>
    <figure className="queen-artwork">
      <img src="/images/reina-2026-960.webp" srcSet="/images/reina-2026-480.webp 480w, /images/reina-2026-960.webp 960w" sizes="(max-width: 700px) 90vw, 440px" width="1320" height="1276" loading="lazy" decoding="async" alt="Presentación de la Reina 2026 de la Calle de las Brujas, con una corona y un sombrero de bruja en tonos dorados y morados" />
    </figure>
  </section>
}

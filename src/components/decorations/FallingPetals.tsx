import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

const petals = Array.from({ length: 22 }, (_, index) => ({
  left: ((index * 47 + 3) % 100) + '%',
  size: (8 + index % 7) + 'px',
  duration: (15 + index % 11) + 's',
  delay: (-((index * 7) % 26)) + 's',
  sway: (25 + (index * 13) % 65) + 'px',
  spin: (index * 39) + 'deg',
}))

export default function FallingPetals() {
  const layer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const update = () => {
      if (layer.current) layer.current.dataset.paused = String(document.hidden)
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return <div ref={layer} className="falling-petals" aria-hidden="true">
    {petals.map((petal, index) => <span className="petal-fall" key={index} style={{
      left: petal.left,
      '--petal-size': petal.size,
      '--fall-duration': petal.duration,
      '--fall-delay': petal.delay,
      '--petal-sway': petal.sway,
      '--petal-spin': petal.spin,
    } as CSSProperties}>
      <span className="petal-sway"><i className={'marigold-petal tone-' + index % 3} /></span>
    </span>)}
  </div>
}

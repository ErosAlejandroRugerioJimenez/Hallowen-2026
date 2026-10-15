import { useEffect, useState } from 'react'
import { event } from '../../data/event'
import { getRemainingTime } from '../../lib/countdown'

export default function Countdown() {
  const [remaining, setRemaining] = useState(() => getRemainingTime(event.startsAt))
  useEffect(() => {
    if (remaining.started) return
    const timer = window.setInterval(() => setRemaining(getRemainingTime(event.startsAt)), 1000)
    return () => window.clearInterval(timer)
  }, [remaining.started])

  if (remaining.started) return <div className="countdown-started" role="status">
    La noche ha llegado. Nos vemos en la Calle de las Brujas.
  </div>

  const units = [
    { label: 'Días', value: remaining.days },
    { label: 'Horas', value: remaining.hours },
    { label: 'Minutos', value: remaining.minutes },
    { label: 'Segundos', value: remaining.seconds },
  ]
  return <div className="event-countdown">
    <p className="countdown-heading">La noche se acerca</p>
    <div className="countdown-grid" role="timer" aria-live="off" aria-label="Tiempo restante para el evento">
      {units.map(unit => <div className="countdown-unit" key={unit.label}>
        <span className="countdown-value">{String(unit.value).padStart(2, '0')}</span>
        <span className="countdown-label">{unit.label}</span>
      </div>)}
    </div>
  </div>
}

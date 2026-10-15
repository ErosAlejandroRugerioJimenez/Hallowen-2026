import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { AmbientAudio } from '../../lib/ambientAudio'

export default function AmbientSound() {
  const engine = useRef<AmbientAudio | null>(null)
  const start = useRef<() => void>(() => {})
  const enabled = useRef(true)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let disposed = false
    let gestureUnlocked = false
    let feedbackTimer: ReturnType<typeof setTimeout> | undefined
    const activate = (fromGesture = false) => {
      if (disposed || !enabled.current || document.hidden) return
      try {
        // A context created by blocked autoplay can remain unusable in Safari.
        // Recreate it once, synchronously inside the first trusted interaction.
        if (fromGesture && (!gestureUnlocked || engine.current?.needsRestart)) {
          engine.current?.dispose()
          engine.current = null
          gestureUnlocked = true
        }
        if (!engine.current) engine.current = new AmbientAudio(value => {
          if (!disposed) setPlaying(value)
        })
        // Call resume inside the gesture; never lock the button while autoplay is pending.
        void engine.current.play().catch(() => {
          if (!disposed && enabled.current) setError('Toca el icono para activar el ambiente.')
        })
        setError('')
        clearTimeout(feedbackTimer)
        if (fromGesture) feedbackTimer = setTimeout(() => {
          if (!disposed && enabled.current && !engine.current?.isPlaying) {
            setError('Toca de nuevo el icono para activar el sonido.')
          }
        }, 2000)
      } catch {
        if (!disposed) setError('No se pudo activar el sonido en este navegador.')
      }
    }
    start.current = () => activate(true)
    const onGesture = (event: Event) => {
      if (!event.isTrusted || (event.target instanceof Element && event.target.closest('.floating-ambient'))) return
      if (!engine.current?.isPlaying) activate(true)
    }
    const onVisibility = () => {
      if (document.hidden) void engine.current?.pause().catch(() => {})
      else activate()
    }
    // Capture the first touch even when a child control stops propagation.
    // The audio toggle is excluded above so a mute never turns itself back on.
    document.addEventListener('pointerup', onGesture, { capture: true, passive: true })
    document.addEventListener('click', onGesture, true)

    document.addEventListener('keydown', onGesture, true)
    document.addEventListener('visibilitychange', onVisibility)
    activate()
    return () => {
      disposed = true
      start.current = () => {}
      document.removeEventListener('pointerup', onGesture, true)
      document.removeEventListener('click', onGesture, true)
      clearTimeout(feedbackTimer)
      document.removeEventListener('keydown', onGesture, true)
      document.removeEventListener('visibilitychange', onVisibility)
      engine.current?.dispose()
      engine.current = null
    }
  }, [])

  function toggle() {
    setError('')
    if (engine.current?.isPlaying) {
      enabled.current = false
      setPlaying(false)
      void engine.current.pause().catch(() => {})
    } else {
      enabled.current = true
      start.current()
    }
  }

  return <div className="floating-ambient">
    {error && <p className="ambient-floating-error" role="status">{error}</p>}
    <div className="ambient-dock">
      <button className="ambient-toggle" type="button" onClick={toggle} aria-label={playing ? 'Apagar ambiente' : 'Activar ambiente'} aria-pressed={playing} title={playing ? 'Apagar ambiente' : 'Activar ambiente'}>
        {playing ? <Volume2 size={19}/> : <VolumeX size={19}/>}
      </button>
    </div>
  </div>
}



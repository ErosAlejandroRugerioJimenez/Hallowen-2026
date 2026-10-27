import { useEffect } from 'react'

/** Distinguish touch/mouse focus from deliberate keyboard navigation. */
export function useInputMethod() {
  useEffect(() => {
    const root = document.documentElement
    const pointer = () => { root.dataset.inputMethod = 'pointer' }
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) root.dataset.inputMethod = 'keyboard'
    }
    document.addEventListener('pointerdown', pointer, true)
    document.addEventListener('keydown', keyboard, true)
    return () => {
      document.removeEventListener('pointerdown', pointer, true)
      document.removeEventListener('keydown', keyboard, true)
      delete root.dataset.inputMethod
    }
  }, [])
}

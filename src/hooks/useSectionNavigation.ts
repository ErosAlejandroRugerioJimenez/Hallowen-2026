import { useEffect } from 'react'

/** Keep section links accessible while navigating without URL fragments. */
export function useSectionNavigation() {
  useEffect(() => {
    const clearFragment = () => {
      if (window.location.hash) {
        window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
      }
    }

    const scrollToSection = (hash: string, smooth: boolean) => {
      let id: string
      try { id = decodeURIComponent(hash.slice(1)) } catch { return false }
      const target = id ? document.getElementById(id) : document.getElementById('contenido')
      if (!target) return false
      // Move keyboard focus as native anchor navigation would, without a jump.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      target.scrollIntoView({
        behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant',
        block: 'start',
      })
      clearFragment()
      return true
    }

    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const hash = link.getAttribute('href')!
      // Prevent native hash navigation only for sections that actually exist.
      const id = hash.slice(1)
      let target: HTMLElement | null
      try { target = document.getElementById(decodeURIComponent(id || 'contenido')) } catch { return }
      if (!target) return
      event.preventDefault()
      scrollToSection(hash, true)
    }

    const restoreLegacyLink = () => {
      const hash = window.location.hash
      if (hash) {
        clearFragment()
        // Run after the browser's native fragment jump.
        window.requestAnimationFrame(() => scrollToSection(hash, false))
      }
    }
    restoreLegacyLink()
    document.addEventListener('click', navigate)
    window.addEventListener('hashchange', restoreLegacyLink)
    return () => {
      document.removeEventListener('click', navigate)
      window.removeEventListener('hashchange', restoreLegacyLink)
    }
  }, [])
}


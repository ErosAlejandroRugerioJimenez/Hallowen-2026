import { useEffect, useRef } from 'react'

export function useReveal() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const nodes = element.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(node => node.classList.add('visible'))
      return
    }

    // Reveal before content reaches the viewport, without waiting for a
    // percentage of a tall section to become visible on small screens.
    element.classList.add('motion-ready')
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('visible')
        reveal.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px 100px 0px', threshold: 0 })
    nodes.forEach(node => reveal.observe(node))

    // Decorative loops only run near the screen.
    const activity = new IntersectionObserver(entries => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting)
      }
    }, { rootMargin: '100px' })
    element.querySelectorAll('section').forEach(node => activity.observe(node))
    const visibility = () => { element.dataset.pageHidden = String(document.hidden) }
    visibility()
    document.addEventListener('visibilitychange', visibility)

    return () => {
      reveal.disconnect()
      activity.disconnect()
      element.classList.remove('motion-ready')
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return root
}

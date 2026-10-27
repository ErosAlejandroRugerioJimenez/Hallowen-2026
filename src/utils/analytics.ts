type AnalyticsEvent = 'como-llegar' | 'abrir-mapa' | 'descargar-cartel' | 'compartir-cartel'

/** Analytics must never interrupt downloads, maps or native sharing. */
export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string>) {
  if (!['lacalledelasbrujas.com', 'www.lacalledelasbrujas.com'].includes(window.location.hostname)) return
  try {
    const client = (window as Window & { umami?: { track: (event: string, data?: Record<string, string>) => unknown } }).umami
    const result = client?.track(name, properties)
    void Promise.resolve(result).catch(() => {})
  } catch { /* The website remains usable if tracking is unavailable. */ }
}

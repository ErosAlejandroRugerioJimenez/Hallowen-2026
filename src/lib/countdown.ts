export type RemainingTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
  started: boolean
}

export function getRemainingTime(target: string, now = Date.now()): RemainingTime {
  const targetTime = Date.parse(target)
  if (!Number.isFinite(targetTime)) throw new Error('La fecha del evento no es válida.')
  const remaining = Math.max(0, Math.ceil((targetTime - now) / 1000))
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    started: now >= targetTime,
  }
}

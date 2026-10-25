'use client'
// Princeton-only live clock, a callback to the essay's 4:30 a.m. opener.
// Ticks every 60s and clears its interval on unmount; renders null for
// every other school since the parent only mounts this for Princeton.
import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

function getPrincetonTime(): { text: string; hour24: number } {
  const parts = formatter.formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const hour = Number(get('hour'))
  const minute = get('minute')
  const period = get('dayPeriod').toLowerCase()
  const periodLabel = period === 'am' ? 'a.m.' : 'p.m.'
  const hour24 = period === 'am' ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12
  return { text: `${hour}:${minute} ${periodLabel}`, hour24 }
}

export default function PrincetonClock() {
  const [time, setTime] = useState<{ text: string; hour24: number } | null>(null)

  useEffect(() => {
    setTime(getPrincetonTime())
    const id = setInterval(() => setTime(getPrincetonTime()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null

  const isInfoSessionHour = time.hour24 >= 4 && time.hour24 < 5

  return (
    <div className="text-center">
      <p
        className={`font-mono text-xs sm:text-sm ${isInfoSessionHour ? 'text-[#E77500]' : 'text-muted'}`}
      >
        It is currently {time.text} in Princeton, New Jersey.
      </p>
      {isInfoSessionHour && (
        <p className="mt-1 font-serif italic text-muted text-xs">
          the hour of a 4:30 a.m. info-session.
        </p>
      )}
    </div>
  )
}

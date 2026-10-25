'use client'
// Princeton-only cinematic title card at the top of the Why Princeton
// section. Fires once, the first time it scrolls into view (which also
// covers the "Why Princeton?" nav link, since that just scrolls here).
// Fully self-contained: renders null for every other school, so nothing
// else on the site is touched by this file.
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

const PLAN_A = 'Plan-A'
const LETTER_MS = 60
const STRIPE_COUNT = 11

// Evenly spaced 60deg diagonal strokes across a 0-0-160-100 box, each the
// same length, so a single shared stroke-dasharray draws them all in sync.
const STRIPES = Array.from({ length: STRIPE_COUNT }, (_, i) => {
  const x = -20 + i * 16
  return { x1: x, y1: -10, x2: x - 46, y2: 110 }
})
const STRIPE_LENGTH = Math.hypot(46, 120)

export default function PrincetonCinematicOpener() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [letterCount, setLetterCount] = useState(0)
  const [maeVisible, setMaeVisible] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setLetterCount(PLAN_A.length)
      setMaeVisible(true)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= PLAN_A.length; i++) {
      timers.push(setTimeout(() => setLetterCount(i), i * LETTER_MS))
    }
    timers.push(setTimeout(() => setMaeVisible(true), PLAN_A.length * LETTER_MS + 90))
    return () => timers.forEach(clearTimeout)
  }, [inView, reducedMotion])

  const triggered = reducedMotion ? true : inView

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden transition-opacity duration-200 ease-out"
      style={{ opacity: triggered ? 1 : 0, backgroundColor: '#0A0A0A' }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 160 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {STRIPES.map((s, i) => (
          <line
            key={i}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke="#E77500"
            strokeOpacity={0.03}
            strokeWidth={1.4}
            strokeDasharray={STRIPE_LENGTH}
            strokeDashoffset={reducedMotion ? 0 : triggered ? 0 : STRIPE_LENGTH}
            style={{
              transition: reducedMotion ? 'none' : `stroke-dashoffset 900ms ease-out ${i * 20}ms`,
            }}
          />
        ))}
      </svg>

      <div className="relative py-20 md:py-28 px-6 text-center">
        <h3
          className="font-serif text-[#E77500] leading-none tracking-[-0.02em]"
          style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}
        >
          {PLAN_A.slice(0, letterCount)}
          <span aria-hidden="true" className="sr-only">
            {PLAN_A.slice(letterCount)}
          </span>
        </h3>
        <p
          className="mt-3 font-serif italic text-zinc-400 transition-opacity duration-500 ease-out"
          style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.75rem)', opacity: maeVisible ? 1 : 0 }}
        >
          MAE at Princeton.
        </p>
      </div>
    </div>
  )
}

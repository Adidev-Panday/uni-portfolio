'use client'
// Harvard-only easter eggs. Everything here renders null unless the
// Harvard theme is the active data-school, so no other theme is touched.
//
// Centerpiece: the "Statue of Three Lies" reveal. It can be triggered
// two ways:
//   1. Clicking the Veritas shield next to the "Why Harvard" heading.
//   2. Typing the word "veritas" anywhere on the page.
// Both call triggerHarvardReveal(), which this file's overlay listens for.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { fireConfetti } from '@/lib/confetti'

const REVEAL_EVENT = 'harvard:reveal'

const REVEAL_LINES = [
  "The John Harvard statue is inscribed 'John Harvard, Founder, 1638.'",
  'All three claims are false.',
  'One: it is not John Harvard, since no likeness survived and the sculptor modeled a student.',
  'Two: he was a benefactor, not the founder.',
  'Three: Harvard was founded in 1636, not 1638.',
]

// Gaps before each line, building steadily toward the three reveals.
const LINE_DELAYS = [0, 900, 1000, 1300, 1200]

export function triggerHarvardReveal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(REVEAL_EVENT))
  }
}

const TOE_LEGEND = "Rub John Harvard's toe for luck. I already have, twice."

// Small crimson shield, three books lettered VE / RI / TAS, placed next
// to the "Why Harvard" heading.
export function VeritasShield() {
  return (
    <span className="relative inline-block group align-middle ml-2">
      <button
        type="button"
        onClick={triggerHarvardReveal}
        title={TOE_LEGEND}
        aria-label="Reveal the Statue of Three Lies"
        className="align-middle rounded-full transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E04257]"
      >
        <svg width="26" height="29" viewBox="0 0 40 44" aria-hidden="true">
          <path
            d="M20 2 L36 8 V22 C36 32 29 40 20 43 C11 40 4 32 4 22 V8 Z"
            fill="#120C0D"
            stroke="#A51C30"
            strokeWidth="1.5"
          />
          <rect x="8.5" y="12" width="9.5" height="6.5" rx="0.6" fill="none" stroke="#E04257" strokeWidth="1" />
          <rect x="22" y="12" width="9.5" height="6.5" rx="0.6" fill="none" stroke="#E04257" strokeWidth="1" />
          <rect x="15.25" y="22.5" width="9.5" height="6.5" rx="0.6" fill="none" stroke="#E04257" strokeWidth="1" />
          <text x="13.25" y="16.6" fontSize="3.6" fill="#E04257" textAnchor="middle" fontFamily="Georgia, serif">VE</text>
          <text x="26.75" y="16.6" fontSize="3.6" fill="#E04257" textAnchor="middle" fontFamily="Georgia, serif">RI</text>
          <text x="20" y="27.1" fontSize="3.6" fill="#E04257" textAnchor="middle" fontFamily="Georgia, serif">TAS</text>
        </svg>
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 w-64 -translate-x-1/2 origin-bottom scale-95 rounded-lg border border-[#A51C30]/30 bg-[#120C0D] px-3 py-2 text-[11px] leading-snug text-zinc-200 opacity-0 shadow-xl transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        {TOE_LEGEND}
      </span>
    </span>
  )
}

// Motto + founding year, used under the "Why Harvard" copy.
export function HarvardMottoLine() {
  return (
    <p
      className="mt-5 text-xs italic text-zinc-400 dark:text-zinc-500"
      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
    >
      Veritas{' '}
      <span className="not-italic text-zinc-500 dark:text-zinc-600">
        (Founded 1636, the oldest college in America)
      </span>
    </p>
  )
}

// Subtle class-year tag for the hero section.
export function HarvardClassTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A51C30]/30 bg-[#A51C30]/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#E04257]">
      Hopeful Crimson, Class of 2030
    </span>
  )
}

// Global overlay: renders the reveal animation, listens for both trigger
// methods, and prints the console nod once per theme activation.
export default function HarvardRevealOverlay() {
  const { schoolId } = useSchoolTheme()
  const [visible, setVisible] = useState(false)
  const [lineCount, setLineCount] = useState(0)
  const typedBuffer = useRef('')
  const loggedRef = useRef(false)
  const playingRef = useRef(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const play = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setVisible(true)
    setLineCount(0)
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    let cumulative = 0
    REVEAL_LINES.forEach((_, i) => {
      cumulative += LINE_DELAYS[i]
      const t = setTimeout(() => setLineCount(i + 1), cumulative)
      timeoutsRef.current.push(t)
    })

    timeoutsRef.current.push(
      setTimeout(() => fireConfetti(['#A51C30', '#E04257', '#FFFFFF', '#F5F1E8']), cumulative + 80),
    )
    timeoutsRef.current.push(
      setTimeout(() => {
        setVisible(false)
        playingRef.current = false
      }, cumulative + 2600),
    )
  }, [])

  useEffect(() => {
    window.addEventListener(REVEAL_EVENT, play)
    return () => window.removeEventListener(REVEAL_EVENT, play)
  }, [play])

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  // "veritas" typed anywhere -- only while the Harvard theme is active.
  useEffect(() => {
    if (schoolId !== 'harvard') return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key.length !== 1) return
      typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-7)
      if (typedBuffer.current === 'veritas') {
        typedBuffer.current = ''
        play()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [schoolId, play])

  // Friendly console nod, once per theme activation.
  useEffect(() => {
    if (schoolId === 'harvard' && !loggedRef.current) {
      loggedRef.current = true
      // eslint-disable-next-line no-console
      console.log('Veritas.')
    }
    if (schoolId !== 'harvard') {
      loggedRef.current = false
    }
  }, [schoolId])

  if (schoolId !== 'harvard') return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="harvard-reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-sm space-y-2 rounded-2xl border border-[#A51C30]/30 bg-[#120C0D]/90 px-8 py-7 text-center shadow-2xl backdrop-blur-md">
            {REVEAL_LINES.map((line, i) => {
              const isFinale = i === REVEAL_LINES.length - 1
              const shown = i < lineCount
              return (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    !shown
                      ? { opacity: 0, y: 8 }
                      : isFinale
                        ? { opacity: 1, y: 0, scale: [1, 1.08, 1] }
                        : { opacity: 1, y: 0 }
                  }
                  transition={isFinale ? { duration: 0.5, ease: 'easeOut' } : { duration: 0.35 }}
                  className={
                    isFinale
                      ? 'text-base font-bold tracking-tight text-[#E04257]'
                      : 'text-sm font-medium text-[#E04257]/90'
                  }
                  style={isFinale ? { fontFamily: 'var(--font-playfair), Georgia, serif' } : undefined}
                >
                  {line}
                </motion.p>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

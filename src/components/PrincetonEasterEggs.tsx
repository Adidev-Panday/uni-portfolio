'use client'
// Princeton-only easter eggs. Everything here renders null unless the
// Princeton theme is the active data-school, so no other theme is touched.
//
// Centerpiece: the "Locomotive" cheer. It can be triggered two ways:
//   1. Clicking the tiger icon next to the "Why Princeton" heading.
//   2. Typing the word "tiger" anywhere on the page.
// Both call triggerPrincetonCheer(), which this file's overlay listens for.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { fireConfetti } from '@/lib/confetti'

const CHEER_EVENT = 'princeton:cheer'

const CHEER_LINES = [
  'Rah, rah, rah',
  'Tiger, tiger, tiger',
  'Sis, sis, sis',
  'Boom, boom, boom, ah!',
  'Princeton! Princeton! Princeton!',
]

// Gaps before each line shrink so the cheer reads like a locomotive
// picking up speed, finishing on a triumphant final chant.
const LINE_DELAYS = [0, 850, 650, 480, 340]

export function triggerPrincetonCheer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CHEER_EVENT))
  }
}

const GATE_LEGEND =
  'Legend says you should not walk out FitzRandolph Gate before graduation. I intend to wait.'

// Small tiger trigger + tooltip, placed next to the "Why Princeton" heading.
export function PrincetonTigerButton() {
  return (
    <span className="relative inline-block group align-middle ml-2">
      <button
        type="button"
        onClick={triggerPrincetonCheer}
        title={GATE_LEGEND}
        aria-label="Play the Princeton Locomotive cheer"
        className="text-xl leading-none align-middle hover:scale-110 active:scale-95 transition-transform duration-150 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8F1C]"
      >
        🐯
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 w-64 -translate-x-1/2 origin-bottom scale-95 rounded-lg border border-[#E77500]/30 bg-[#0A0A0A] px-3 py-2 text-[11px] leading-snug text-zinc-200 opacity-0 shadow-xl transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        {GATE_LEGEND}
      </span>
    </span>
  )
}

// Small elegant line for the official Latin motto, used under the
// "Why Princeton" copy.
export function PrincetonMottoLine() {
  return (
    <p
      className="mt-5 text-xs italic text-zinc-400 dark:text-zinc-500"
      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
    >
      Dei Sub Numine Viget{' '}
      <span className="not-italic text-zinc-500 dark:text-zinc-600">
        (&quot;Under God&apos;s Power She Flourishes&quot;)
      </span>
    </p>
  )
}

// Subtle class-year tag for the hero section.
export function PrincetonClassTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E77500]/30 bg-[#E77500]/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#FF8F1C]">
      🐯 Hopeful Tiger, Class of 2030
    </span>
  )
}

// Global overlay: renders the cheer animation, listens for both trigger
// methods, and prints the console nod once per theme activation.
export default function PrincetonCheerOverlay() {
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
    CHEER_LINES.forEach((_, i) => {
      cumulative += LINE_DELAYS[i]
      const t = setTimeout(() => setLineCount(i + 1), cumulative)
      timeoutsRef.current.push(t)
    })

    timeoutsRef.current.push(setTimeout(() => fireConfetti(), cumulative + 80))
    timeoutsRef.current.push(
      setTimeout(() => {
        setVisible(false)
        playingRef.current = false
      }, cumulative + 2200),
    )
  }, [])

  useEffect(() => {
    window.addEventListener(CHEER_EVENT, play)
    return () => window.removeEventListener(CHEER_EVENT, play)
  }, [play])

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  // "tiger" typed anywhere -- only while the Princeton theme is active.
  useEffect(() => {
    if (schoolId !== 'princeton') return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key.length !== 1) return
      typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-5)
      if (typedBuffer.current === 'tiger') {
        typedBuffer.current = ''
        play()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [schoolId, play])

  // Friendly console nod, once per theme activation.
  useEffect(() => {
    if (schoolId === 'princeton' && !loggedRef.current) {
      loggedRef.current = true
      // eslint-disable-next-line no-console
      console.log('Rah, rah, rah. Tiger, tiger, tiger. Three cheers for Old Nassau.')
    }
    if (schoolId !== 'princeton') {
      loggedRef.current = false
    }
  }, [schoolId])

  if (schoolId !== 'princeton') return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="princeton-cheer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-xs space-y-1.5 rounded-2xl border border-[#E77500]/30 bg-[#0A0A0A]/90 px-8 py-7 text-center shadow-2xl backdrop-blur-md">
            {CHEER_LINES.map((line, i) => {
              const isFinale = i === CHEER_LINES.length - 1
              const shown = i < lineCount
              return (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    !shown
                      ? { opacity: 0, y: 8 }
                      : isFinale
                        ? { opacity: 1, y: 0, scale: [1, 1.12, 1], x: [0, -2, 2, -2, 0] }
                        : { opacity: 1, y: 0 }
                  }
                  transition={isFinale ? { duration: 0.5, ease: 'easeOut' } : { duration: 0.3 }}
                  className={
                    isFinale
                      ? 'text-lg font-bold tracking-tight text-[#FF8F1C]'
                      : 'text-sm font-medium text-[#FF8F1C]/90'
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

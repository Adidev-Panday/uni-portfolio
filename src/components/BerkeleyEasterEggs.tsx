'use client'
// Berkeley-only easter eggs. Everything here renders null unless the
// Berkeley theme is the active data-school, so no other theme is touched.
//
// Centerpiece: "Fiat Lux", featured prominently in the Why Berkeley
// section, with a lights-coming-on flourish when Berkeley is selected
// (see AdmissionsModal). The Oski yell is a second, playful reveal:
//   1. Clicking the bear glyph next to the "Why Berkeley" heading.
//   2. Typing "oski" or "go bears" anywhere on the page.
// Both call triggerOskiYell(), which this file's overlay listens for.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Clock } from 'lucide-react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { fireConfetti } from '@/lib/confetti'

const YELL_EVENT = 'berkeley:oski'

const YELL_LINES = ['Oski wow wow!', 'Whiskey wee wee!', 'Go Bears!']

// Gaps before each line, rising into the finale.
const LINE_DELAYS = [0, 700, 750]

export function triggerOskiYell() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(YELL_EVENT))
  }
}

const BERKELEY_TIME_TIP = 'Set to Berkeley Time. Everything here starts ten minutes late.'
const BALL_TIP = 'Rub the 4.0 Ball for luck. Berkeley students swear by it.'
const BEAR_TIP = 'Oski wow wow! Click for the Berkeley yell.'

// Small tooltip wrapper shared by the three inline Berkeley affordances.
function TipWrapper({
  children,
  tip,
  tipClassName,
}: {
  children: React.ReactNode
  tip: string
  tipClassName?: string
}) {
  return (
    <span className="relative inline-block group align-middle ml-2">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 w-56 -translate-x-1/2 origin-bottom scale-95 rounded-lg border border-[#FDB515]/30 bg-[#00223F] px-3 py-2 text-[11px] leading-snug text-zinc-100 opacity-0 shadow-xl transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 ${tipClassName ?? ''}`}
      >
        {tip}
      </span>
    </span>
  )
}

// Small golden bear glyph next to "Why Berkeley" -- click plays the Oski yell.
export function OskiBearButton() {
  return (
    <TipWrapper tip={BEAR_TIP}>
      <button
        type="button"
        onClick={triggerOskiYell}
        title={BEAR_TIP}
        aria-label="Play the Oski yell"
        className="text-xl leading-none align-middle rounded-full transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB515]"
      >
        🐻
      </button>
    </TipWrapper>
  )
}

// Small clock icon: the "Berkeley Time" tooltip, no click action.
export function BerkeleyTimeTip() {
  return (
    <TipWrapper tip={BERKELEY_TIME_TIP}>
      <button
        type="button"
        title={BERKELEY_TIME_TIP}
        aria-label="Berkeley Time"
        className="align-middle text-[#FDB515]/80 rounded-full transition-colors duration-150 hover:text-[#FDB515] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB515]"
      >
        <Clock size={16} />
      </button>
    </TipWrapper>
  )
}

// Small gold sphere: the "4.0 Ball" by the Campanile, tooltip only.
export function FortyBall() {
  return (
    <TipWrapper tip={BALL_TIP}>
      <button
        type="button"
        title={BALL_TIP}
        aria-label="The 4.0 Ball"
        className="inline-block h-4 w-4 rounded-full align-middle transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB515]"
        style={{ background: 'radial-gradient(circle at 35% 30%, #FFE9A8, #FDB515 60%, #B9860B 100%)' }}
      />
    </TipWrapper>
  )
}

// Prominent "Fiat Lux" motto block, featured in the Why Berkeley section.
export function FiatLuxBlock() {
  return (
    <div className="relative mt-8 py-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 mx-auto max-w-xs rounded-full blur-2xl"
        style={{ background: 'radial-gradient(ellipse, rgb(253 181 21 / 0.22) 0%, transparent 70%)' }}
      />
      <p
        className="relative text-3xl sm:text-4xl font-bold tracking-tight text-[#FDB515]"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        Fiat Lux
      </p>
      <p className="relative mt-1.5 text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
        Let There Be Light
      </p>
    </div>
  )
}

// Subtle class-year tag for the hero section.
export function BerkeleyClassTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FDB515]/40 bg-[#FDB515]/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#FDB515]">
      🐻 Hopeful Golden Bear, Class of 2030
    </span>
  )
}

// Global overlay: renders the Oski yell animation, listens for both
// trigger methods, and prints the console nod once per theme activation.
export default function BerkeleyOskiOverlay() {
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
    YELL_LINES.forEach((_, i) => {
      cumulative += LINE_DELAYS[i]
      const t = setTimeout(() => setLineCount(i + 1), cumulative)
      timeoutsRef.current.push(t)
    })

    timeoutsRef.current.push(
      setTimeout(() => fireConfetti(['#003262', '#FDB515', '#FFFFFF']), cumulative + 80),
    )
    timeoutsRef.current.push(
      setTimeout(() => {
        setVisible(false)
        playingRef.current = false
      }, cumulative + 2000),
    )
  }, [])

  useEffect(() => {
    window.addEventListener(YELL_EVENT, play)
    return () => window.removeEventListener(YELL_EVENT, play)
  }, [play])

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  // "oski" or "go bears" typed anywhere -- only while Berkeley is active.
  useEffect(() => {
    if (schoolId !== 'uc-berkeley') return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key.length !== 1) return
      typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-8)
      if (typedBuffer.current.endsWith('oski') || typedBuffer.current.endsWith('go bears')) {
        typedBuffer.current = ''
        play()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [schoolId, play])

  // Friendly console nod, once per theme activation.
  useEffect(() => {
    if (schoolId === 'uc-berkeley' && !loggedRef.current) {
      loggedRef.current = true
      // eslint-disable-next-line no-console
      console.log('Fiat Lux. Go Bears.')
    }
    if (schoolId !== 'uc-berkeley') {
      loggedRef.current = false
    }
  }, [schoolId])

  if (schoolId !== 'uc-berkeley') return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="berkeley-yell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-xs space-y-2 rounded-2xl border border-[#FDB515]/30 bg-[#00223F]/90 px-8 py-7 text-center shadow-2xl backdrop-blur-md">
            {YELL_LINES.map((line, i) => {
              const isFinale = i === YELL_LINES.length - 1
              const shown = i < lineCount
              return (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 14 }}
                  animate={
                    !shown
                      ? { opacity: 0, y: 14 }
                      : isFinale
                        ? { opacity: 1, y: 0, scale: [1, 1.15, 1] }
                        : { opacity: 1, y: 0 }
                  }
                  transition={isFinale ? { duration: 0.5, ease: 'easeOut' } : { duration: 0.35, ease: 'easeOut' }}
                  className={
                    isFinale
                      ? 'text-lg font-bold tracking-tight text-[#FDB515]'
                      : 'text-base font-semibold text-[#FDB515]/90'
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

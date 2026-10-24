'use client'
// Shared "showpiece" engine for every school in SCHOOL_MOTIFS (everyone
// except Princeton, Harvard, and UC Berkeley, which keep their own
// hand-built easter-egg files). Two exports:
//   - MottoLine: the small italic serif motto citation under the Why
//     School bullets, matching PrincetonMottoLine/HarvardMottoLine.
//   - SchoolMotifOverlay: a global, always-mounted component that
//     listens for the active school's trigger word being typed
//     anywhere on the page, then plays a staggered line reveal with a
//     themed confetti burst and a one-time console nod -- the same
//     shape as the Locomotive cheer / Statue of Three Lies / Oski yell,
//     configured per school instead of hand-built per school.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { fireConfetti } from '@/lib/confetti'
import { SCHOOL_MOTIFS } from '@/data/schoolMotifs'

export function MottoLine({ schoolId }: { schoolId: string }) {
  const motif = SCHOOL_MOTIFS[schoolId]
  if (!motif?.motto) return null
  return (
    <p
      className="mt-5 text-xs italic text-muted"
      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
    >
      {motif.motto}
      {motif.mottoTranslation && (
        <span className="not-italic text-muted/70"> ({motif.mottoTranslation})</span>
      )}
    </p>
  )
}

const BESPOKE_SCHOOLS = new Set(['princeton', 'harvard', 'uc-berkeley'])

export default function SchoolMotifOverlay() {
  const { schoolId } = useSchoolTheme()
  const [visible, setVisible] = useState(false)
  const [lineCount, setLineCount] = useState(0)
  const typedBuffer = useRef('')
  const loggedForRef = useRef<string | null>(null)
  const playingRef = useRef(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const motif = schoolId && !BESPOKE_SCHOOLS.has(schoolId) ? SCHOOL_MOTIFS[schoolId] : undefined

  const play = useCallback(() => {
    if (!motif || playingRef.current) return
    playingRef.current = true
    setVisible(true)
    setLineCount(0)
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    let cumulative = 0
    motif.revealLines.forEach((_, i) => {
      cumulative += i === 0 ? 0 : 700
      const t = setTimeout(() => setLineCount(i + 1), cumulative)
      timeoutsRef.current.push(t)
    })

    timeoutsRef.current.push(setTimeout(() => fireConfetti(motif.confettiColors), cumulative + 80))
    timeoutsRef.current.push(
      setTimeout(() => {
        setVisible(false)
        playingRef.current = false
      }, cumulative + 2200),
    )
  }, [motif])

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  // Trigger word typed anywhere -- only while a motif'd school is active.
  useEffect(() => {
    if (!motif) return
    const word = motif.triggerWord
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key.length !== 1) return
      typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-Math.max(word.length, 8))
      if (typedBuffer.current.endsWith(word)) {
        typedBuffer.current = ''
        play()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [motif, play])

  // Friendly console nod, once per theme activation.
  useEffect(() => {
    if (motif && loggedForRef.current !== schoolId) {
      loggedForRef.current = schoolId
      // eslint-disable-next-line no-console
      console.log(motif.consoleLine)
    }
    if (!motif) loggedForRef.current = null
  }, [motif, schoolId])

  if (!motif || !visible) return null

  const isFinale = (i: number) => i === motif.revealLines.length - 1

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`motif-${schoolId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-sm space-y-2 rounded border border-rule bg-paper/95 px-8 py-7 text-center">
            {motif.revealLines.map((line, i) => {
              const shown = i < lineCount
              return (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 10 }}
                  animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: isFinale(i) ? 0.5 : 0.35, ease: 'easeOut' }}
                  className={isFinale(i) ? 'text-lg font-bold tracking-tight text-accent' : 'text-sm font-medium text-ink/80'}
                  style={isFinale(i) ? { fontFamily: 'var(--font-playfair), Georgia, serif' } : undefined}
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

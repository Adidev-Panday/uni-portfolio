'use client'
// Admissions officer first-visit experience.
// Step 1: "Are you an admissions officer?" Yes / No
// Step 2: School picker (alphabetical list)
// On selection: applies CSS custom-property theme to <html data-school="...">
// Persists choice in sessionStorage so modal does not repeat within a session.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SCHOOLS, type SchoolId } from '@/data/schools'
import { fireConfetti } from '@/lib/confetti'
import { fireLightsOn } from '@/lib/lightsOn'
import { pushModalOpen, popModalOpen } from '@/lib/modalDepth'
import { ModalBackdrop, ModalPanel } from './ModalPanel'

const SESSION_KEY = 'admissions-choice'

function applySchool(id: SchoolId) {
  document.documentElement.setAttribute('data-school', id)
}

function clearSchool() {
  document.documentElement.removeAttribute('data-school')
}

type Step = 'idle' | 'question' | 'picker'

export default function AdmissionsModal() {
  const [step, setStep]               = useState<Step>('idle')
  const [activeSchool, setActiveSchool] = useState<SchoolId | null>(null)
  const [mounted, setMounted]         = useState(false)

  const yesBtnRef   = useRef<HTMLButtonElement>(null)
  const backBtnRef  = useRef<HTMLButtonElement>(null)
  const pickerBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (!stored) {
        const t = setTimeout(() => setStep('question'), 650)
        return () => clearTimeout(t)
      } else if (stored !== 'no') {
        applySchool(stored as SchoolId)
        setActiveSchool(stored as SchoolId)
      }
    } catch {
      // sessionStorage unavailable, degrade gracefully
    }
  }, [])

  // Force the picker's school list back to the top on every open, before
  // paint, since a later focus() call (below) can otherwise scroll a
  // tall list into view and leave the panel opening mid-list instead
  // of at Bocconi. Runs before the autofocus effect (layout effects
  // fire before passive effects), and the list state never persists
  // across opens since this always zeroes it out first.
  useLayoutEffect(() => {
    if (step === 'picker' && pickerBodyRef.current) {
      pickerBodyRef.current.scrollTop = 0
    }
  }, [step])

  useEffect(() => {
    // preventScroll: true -- the school picker's "back" link sits at
    // the bottom of a long scrollable list; without it, focusing the
    // link scrolls that list down to bring it into view.
    if (step === 'question') yesBtnRef.current?.focus({ preventScroll: true })
    if (step === 'picker')   backBtnRef.current?.focus({ preventScroll: true })
  }, [step])

  useEffect(() => {
    if (step === 'idle') return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [step])

  useEffect(() => {
    if (step === 'idle') return
    pushModalOpen()
    return () => popModalOpen()
  }, [step])

  const dismiss = () => {
    try { sessionStorage.setItem(SESSION_KEY, 'no') } catch { /* ignore */ }
    setStep('idle')
  }

  const selectSchool = (id: SchoolId) => {
    applySchool(id)
    setActiveSchool(id)
    try { sessionStorage.setItem(SESSION_KEY, id) } catch { /* ignore */ }
    setStep('idle')
    if (id === 'princeton') fireConfetti()
    if (id === 'uc-berkeley') fireLightsOn()
  }

  const reset = () => {
    clearSchool()
    setActiveSchool(null)
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
  }

  if (!mounted) return null

  const schoolShortName = activeSchool
    ? (SCHOOLS.find((s) => s.id === activeSchool)?.shortName ?? '')
    : ''

  const overlayOpen = step === 'question' || step === 'picker'

  return (
    <>
      <AnimatePresence>
        {overlayOpen && <ModalBackdrop key="overlay" onClick={dismiss} />}
      </AnimatePresence>

      {/* Step 1: Are you an admissions officer? */}
      <AnimatePresence>
        {step === 'question' && (
          <ModalPanel
            key="question"
            titleId="adm-title"
            title="Are you an admissions officer?"
            onClose={dismiss}
            maxWidthClass="max-w-md"
          >
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-4">
              Welcome
            </p>
            <p className="text-sm text-ink/70 mb-8">
              Trust me, click yes if you are an AO.
            </p>
            <p className="font-mono text-sm">
              <button
                ref={yesBtnRef}
                onClick={() => setStep('picker')}
                className="text-accent underline underline-offset-4 hover:no-underline"
              >
                yes
              </button>
              <span className="text-muted mx-3">/</span>
              <button onClick={dismiss} className="text-ink underline underline-offset-4 hover:text-accent">
                no
              </button>
            </p>
          </ModalPanel>
        )}
      </AnimatePresence>

      {/* Step 2: School picker */}
      <AnimatePresence>
        {step === 'picker' && (
          <ModalPanel
            key="picker"
            titleId="picker-title"
            title="Which institution are you visiting from?"
            onClose={dismiss}
            maxWidthClass="max-w-md"
            bodyRef={pickerBodyRef}
          >
            {/* Sticky under the panel's fixed heading, so it stays in
                view no matter how far down the list the user scrolls. */}
            <p className="sticky top-0 z-10 bg-paper pb-3 font-mono text-xs text-muted">
              Listed alphabetically.
            </p>

            <ul className="font-mono text-sm border-t border-rule" role="listbox" aria-label="Select your institution">
              {SCHOOLS.map((school) => (
                <li key={school.id} role="option" aria-selected={false} className="border-b border-rule">
                  <button
                    onClick={() => selectSchool(school.id)}
                    className="w-full text-left py-3 px-1 text-ink hover:bg-ink hover:text-paper transition-colors duration-150"
                  >
                    {school.name}
                  </button>
                </li>
              ))}
            </ul>

            <button
              ref={backBtnRef}
              onClick={() => setStep('question')}
              className="mt-6 font-mono text-sm text-muted underline underline-offset-4 hover:text-ink"
            >
              back
            </button>
          </ModalPanel>
        )}
      </AnimatePresence>

      {/* Reset indicator -- shown when a school theme is active */}
      <AnimatePresence>
        {activeSchool && (
          <motion.div
            key="reset-pill"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[72px] right-4 z-[100] flex items-center gap-3 px-3 py-1.5 font-mono text-xs bg-paper border border-rule"
          >
            <span className="text-muted">
              Viewing in <span className="text-accent">{schoolShortName}</span> colors
            </span>
            <button
              onClick={reset}
              className="text-muted underline underline-offset-4 hover:text-accent"
              aria-label="Reset school theme"
            >
              reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

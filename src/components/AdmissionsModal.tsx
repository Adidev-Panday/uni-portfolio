'use client'
// Admissions officer first-visit experience.
// Step 1: "Are you an admissions officer?" Yes / No
// Step 2: School picker (alphabetical list)
// On selection: applies CSS custom-property theme to <html data-school="...">
// Persists choice in sessionStorage so modal does not repeat within a session.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

const SESSION_KEY = 'admissions-choice'

const SCHOOLS = [
  { id: 'bocconi',      name: 'Bocconi',                                   shortName: 'Bocconi'      },
  { id: 'georgia-tech', name: 'Georgia Tech',                               shortName: 'Georgia Tech' },
  { id: 'harvard',      name: 'Harvard',                                   shortName: 'Harvard'      },
  { id: 'hku-berkeley', name: 'HKU-Berkeley (Dual Degree)',                 shortName: 'HKU-Berkeley' },
  { id: 'nus',          name: 'National University of Singapore (NUS)',     shortName: 'NUS'          },
  { id: 'princeton',    name: 'Princeton',                                  shortName: 'Princeton'    },
  { id: 'purdue',       name: 'Purdue',                                     shortName: 'Purdue'       },
  { id: 'tu-delft',     name: 'TU Delft',                                  shortName: 'TU Delft'     },
  { id: 'tum',          name: 'TUM',                                       shortName: 'TUM'          },
  { id: 'uc-berkeley',  name: 'UC Berkeley',                               shortName: 'UC Berkeley'  },
  { id: 'uc-davis',     name: 'UC Davis',                                  shortName: 'UC Davis'     },
  { id: 'uc-irvine',    name: 'UC Irvine',                                 shortName: 'UC Irvine'    },
  { id: 'uc-san-diego', name: 'UC San Diego',                              shortName: 'UC San Diego' },
  { id: 'ucla',         name: 'UCLA',                                      shortName: 'UCLA'         },
  { id: 'bath',         name: 'University of Bath',                        shortName: 'Bath'         },
  { id: 'bristol',      name: 'University of Bristol',                     shortName: 'Bristol'      },
  { id: 'uiuc',         name: 'University of Illinois (UIUC)',             shortName: 'UIUC'         },
  { id: 'manchester',   name: 'University of Manchester',                  shortName: 'Manchester'   },
  { id: 'melbourne',    name: 'University of Melbourne',                   shortName: 'Melbourne'    },
  { id: 'michigan',     name: 'University of Michigan (Ann Arbor)',        shortName: 'Michigan'     },
  { id: 'sheffield',    name: 'University of Sheffield',                   shortName: 'Sheffield'    },
  { id: 'southampton',  name: 'University of Southampton',                 shortName: 'Southampton'  },
] as const

type SchoolId = (typeof SCHOOLS)[number]['id']

function applySchool(id: SchoolId) {
  document.documentElement.setAttribute('data-school', id)
}

function clearSchool() {
  document.documentElement.removeAttribute('data-school')
}

type Step = 'idle' | 'question' | 'picker'

// Shared modal card animation
const cardAnim = {
  initial:    { opacity: 0, scale: 0.93, y: 8 },
  animate:    { opacity: 1, scale: 1,    y: 0 },
  exit:       { opacity: 0, scale: 0.93, y: 8 },
  transition: { duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] as const },
}

export default function AdmissionsModal() {
  const [step, setStep]               = useState<Step>('idle')
  const [activeSchool, setActiveSchool] = useState<SchoolId | null>(null)
  const [mounted, setMounted]         = useState(false)

  // Button refs for autofocus inside modals
  const yesBtnRef  = useRef<HTMLButtonElement>(null)
  const backBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (!stored) {
        // First visit this session: show prompt after page renders
        const t = setTimeout(() => setStep('question'), 650)
        return () => clearTimeout(t)
      } else if (stored !== 'no') {
        // Returning session with a school choice: reapply theme silently
        applySchool(stored as SchoolId)
        setActiveSchool(stored as SchoolId)
      }
    } catch {
      // sessionStorage unavailable — degrade gracefully
    }
  }, [])

  // Autofocus first interactive element when step changes
  useEffect(() => {
    if (step === 'question') yesBtnRef.current?.focus()
    if (step === 'picker')   backBtnRef.current?.focus()
  }, [step])

  // ESC key dismisses any open modal
  useEffect(() => {
    if (step === 'idle') return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
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
      {/* Backdrop overlay */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-[2px]"
            onClick={dismiss}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Step 1 — Are you an admissions officer? */}
      <AnimatePresence>
        {step === 'question' && (
          <motion.div
            key="question"
            {...cardAnim}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adm-title"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-8 pointer-events-auto">
              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>

              <div className="text-center space-y-6 pt-1">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                    Welcome
                  </p>
                  <h2
                    id="adm-title"
                    className="text-xl font-bold tracking-tight leading-snug"
                  >
                    Are you an admissions officer?
                  </h2>
                </div>

                <div className="flex gap-3">
                  <button
                    ref={yesBtnRef}
                    onClick={() => setStep('picker')}
                    className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold bg-accent-fill text-white hover:opacity-90 active:scale-95 transition-all duration-150"
                  >
                    Yes
                  </button>
                  <button
                    onClick={dismiss}
                    className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-accent hover:text-accent active:scale-95 transition-all duration-150"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2 — School picker */}
      <AnimatePresence>
        {step === 'picker' && (
          <motion.div
            key="picker"
            {...cardAnim}
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-title"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl pointer-events-auto flex flex-col"
              style={{ maxHeight: 'min(580px, 90dvh)' }}
            >
              {/* Header */}
              <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2
                  id="picker-title"
                  className="text-[17px] font-bold tracking-tight leading-snug"
                >
                  Which institution are you visiting from?
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Listed alphabetically.</p>
              </div>

              {/* Scrollable school list */}
              <ul
                className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"
                role="listbox"
                aria-label="Select your institution"
              >
                {SCHOOLS.map((school) => (
                  <li key={school.id} role="option" aria-selected={false}>
                    <button
                      onClick={() => selectSchool(school.id)}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-accent/10 hover:text-accent active:scale-[0.98] transition-all duration-100"
                    >
                      {school.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Back footer */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  ref={backBtnRef}
                  onClick={() => setStep('question')}
                  className="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset pill -- shown when a school theme is active */}
      <AnimatePresence>
        {activeSchool && (
          <motion.div
            key="reset-pill"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[72px] right-4 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <span className="text-zinc-500 dark:text-zinc-400">
              Viewing in{' '}
              <span className="text-accent font-semibold">{schoolShortName}</span>{' '}
              colours.
            </span>
            <button
              onClick={reset}
              className="text-zinc-400 hover:text-accent transition-colors font-medium"
              aria-label="Reset school theme"
            >
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

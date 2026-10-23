'use client'
// Research section: displays published papers as rich cards.
// Clicking anywhere on a card opens a confirmation modal before navigating,
// matching the project cards exactly.
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ExternalLink, BookOpen, X } from 'lucide-react'
import { research, type ResearchPaper } from '@/data/content'
import { modalCardAnim, pressTap, pressTransition, springUI } from '@/lib/motion'
import { pushModalOpen, popModalOpen } from '@/lib/modalDepth'
import ModalPortal from './ModalPortal'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

// Status → color mapping for the badge
const statusStyles: Record<string, string> = {
  published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  preprint: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'in review': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  unpublished: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
}

// Shared modal card animation (matches the project cards)
const cardAnim = modalCardAnim

export default function Research() {
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null)
  // Where the modal should scale from/to: the card that was actually
  // clicked, so the popup is spatially anchored to its trigger.
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const openBtnRef = useRef<HTMLAnchorElement>(null)

  const openFromCard = (paper: ResearchPaper, rect: DOMRect) => {
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setActivePaper(paper)
  }

  const close = () => setActivePaper(null)

  // ESC key dismisses the open modal
  useEffect(() => {
    if (!activePaper) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activePaper])

  // Autofocus the primary action when the modal opens
  useEffect(() => {
    if (!activePaper) return
    openBtnRef.current?.focus()
  }, [activePaper])

  // Push the page content back slightly while the modal is open
  useEffect(() => {
    if (!activePaper) return
    pushModalOpen()
    return () => popModalOpen()
  }, [activePaper])

  return (
    <>
    <section id="research" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="04."
            title="Research"
            subtitle="Published work and ongoing investigations."
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {research.map((paper, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)}>
              <motion.article
                role="button"
                tabIndex={0}
                onClick={(e) => openFromCard(paper, e.currentTarget.getBoundingClientRect())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openFromCard(paper, e.currentTarget.getBoundingClientRect())
                  }
                }}
                className="school-card group flex flex-col h-full p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white shadow-sm dark:bg-zinc-900/50 dark:shadow-none hover:border-accent/40 transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                whileHover={{
                  y: -5,
                  boxShadow: '0 24px 48px -8px rgb(var(--accent-rgb) / 0.10)',
                }}
                transition={springUI}
              >
                {/* Header row: status badge + decorative redirect indicator */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyles[paper.status.toLowerCase()] ?? statusStyles.published}`}
                  >
                    <BookOpen size={11} />
                    {paper.statusLabel}
                  </span>

                  {/* Decorative redirect indicator; clicks fall through to the card */}
                  <ExternalLink
                    size={16}
                    className="text-zinc-400 group-hover:text-accent transition-colors shrink-0"
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 group-hover:text-accent transition-colors duration-200">
                  {paper.title}
                </h3>

                {/* Journal + year */}
                <p className="text-sm text-zinc-500 mb-1">
                  {paper.journal}
                  <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
                  {paper.year}
                </p>

                {/* Optional page note */}
                {paper.pageNote && (
                  <p className="text-xs text-zinc-400 mb-4 font-mono">{paper.pageNote}</p>
                )}

                {/* Abstract */}
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                  {paper.abstract}
                </p>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Backdrop and modal portal straight to <body>: <main> gets pushed
        back (transform/filter) while a modal is open, which would
        otherwise become the containing block for these fixed-position
        elements and pin them to <main>'s box instead of the viewport. */}
    <ModalPortal>
      {/* Confirmation modal: backdrop */}
      <AnimatePresence>
        {activePaper && (
          <motion.div
            key="research-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-scrim fixed inset-0 z-[200] bg-black/55 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Confirmation modal: card */}
      <AnimatePresence>
        {activePaper && (
          <motion.div
            key="research-modal"
            {...cardAnim}
            style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="research-modal-title"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-8 pointer-events-auto">
              {/* Close */}
              <motion.button
                onClick={close}
                whileTap={pressTap}
                transition={pressTransition}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </motion.button>

              <div className="text-center space-y-6 pt-1">
                <div className="space-y-2">
                  <h2
                    id="research-modal-title"
                    className="text-xl font-bold tracking-tight leading-snug"
                  >
                    {activePaper.modalTitle}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {activePaper.modalBlurb}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.a
                    ref={openBtnRef}
                    href={activePaper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    whileTap={pressTap}
                    transition={pressTransition}
                    className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold bg-accent-fill text-white hover:opacity-90 transition-colors duration-150"
                  >
                    {activePaper.modalButtonLabel}
                  </motion.a>
                  <motion.button
                    onClick={close}
                    whileTap={pressTap}
                    transition={pressTransition}
                    className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-accent hover:text-accent transition-colors duration-150"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
    </>
  )
}

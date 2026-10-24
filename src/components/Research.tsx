'use client'
// Research section: two publications as clickable editorial cards, not
// a stacked magazine spread. Hairline border, 6px radius, no shadow,
// no gradient. Clicking a card opens a confirmation modal.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { research, type ResearchPaper } from '@/data/content'
import { pushModalOpen, popModalOpen } from '@/lib/modalDepth'
import { ModalBackdrop, ModalPanel } from './ModalPanel'
import ModalPortal from './ModalPortal'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Research() {
  const [activePaper, setActivePaper] = useState<ResearchPaper | null>(null)
  const openBtnRef = useRef<HTMLAnchorElement>(null)

  const close = () => setActivePaper(null)

  useEffect(() => {
    if (!activePaper) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activePaper])

  useEffect(() => {
    if (!activePaper) return
    openBtnRef.current?.focus()
  }, [activePaper])

  useEffect(() => {
    if (!activePaper) return
    pushModalOpen()
    return () => popModalOpen()
  }, [activePaper])

  return (
    <>
    <section id="research" className="py-20">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="04."
            title="Research"
            subtitle="Published work and ongoing investigations."
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {research.map((paper, i) => (
            <ScrollReveal key={i} delay={Math.min(i * 0.06, 0.12)} className="h-full">
              <article
                role="button"
                tabIndex={0}
                onClick={() => setActivePaper(paper)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActivePaper(paper)
                  }
                }}
                className="group h-full flex flex-col p-6 sm:p-8 border border-rule rounded bg-paper hover:bg-ink/[0.03] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                    {paper.statusLabel}
                  </span>
                  <span className="font-mono text-sm text-muted group-hover:text-accent transition-colors" aria-hidden="true">
                    &#8599;
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-ink group-hover:text-accent transition-colors duration-200 mb-2">
                  {paper.title}
                </h3>

                <p className="italic font-serif text-sm text-muted mb-4">
                  {paper.journal}, {paper.year}
                  {paper.pageNote && <span className="not-italic font-mono text-xs ml-2">({paper.pageNote})</span>}
                </p>

                <p className="text-sm text-ink/80 leading-relaxed flex-1">
                  {paper.abstract}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Backdrop and modal portal straight to <body>, same reasoning as
        the Projects confirmation modal. */}
    <ModalPortal>
      <AnimatePresence>
        {activePaper && <ModalBackdrop key="research-overlay" onClick={close} />}
      </AnimatePresence>

      <AnimatePresence>
        {activePaper && (
          <ModalPanel
            key="research-modal"
            titleId="research-modal-title"
            title={activePaper.modalTitle}
            onClose={close}
          >
            <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line mb-8">
              {activePaper.modalBlurb}
            </p>
            <p className="font-mono text-sm">
              <a
                ref={openBtnRef}
                href={activePaper.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="text-accent underline underline-offset-4 hover:no-underline"
              >
                {activePaper.modalButtonLabel} &#8599;
              </a>
              <span className="text-muted mx-3">or</span>
              <button onClick={close} className="text-ink underline underline-offset-4 hover:text-accent">
                cancel
              </button>
            </p>
          </ModalPanel>
        )}
      </AnimatePresence>
    </ModalPortal>
    </>
  )
}

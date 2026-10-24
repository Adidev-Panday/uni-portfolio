'use client'
// Research section: two publications in editorial citation format --
// serif title, italic serif venue/year, body-sans abstract -- not two
// matching cards. Clicking a citation opens a confirmation panel,
// matching the Projects list.
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

        <div className="border-t border-rule">
          {research.map((paper, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)} className="border-b border-rule">
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
                className="group py-10 px-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-2">
                  {paper.statusLabel}
                </p>

                <h3 className="font-serif text-2xl sm:text-3xl text-ink group-hover:text-accent transition-colors duration-200">
                  {paper.title}{' '}
                  <span className="font-mono text-base text-muted group-hover:text-accent">&#8599;</span>
                </h3>

                <p className="italic font-serif text-base text-muted mt-2">
                  {paper.journal}, {paper.year}
                  {paper.pageNote && <span className="not-italic font-mono text-xs ml-2">({paper.pageNote})</span>}
                </p>

                <p className="text-ink/80 leading-relaxed mt-4 max-w-[70ch]">
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

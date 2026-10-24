'use client'
// Projects section: full-width editorial list, not a card grid. Each
// row shows the name in serif on the left and mono metadata on the
// right; hovering inverts the row (ink becomes paper, and back).
// Clicking a row opens a confirmation panel before navigating.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { projects, type Project } from '@/data/content'
import { pushModalOpen, popModalOpen } from '@/lib/modalDepth'
import { ModalBackdrop, ModalPanel } from './ModalPanel'
import ModalPortal from './ModalPortal'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const primaryBtnRef = useRef<HTMLAnchorElement>(null)
  const gotItBtnRef = useRef<HTMLButtonElement>(null)

  const close = () => setActiveProject(null)

  useEffect(() => {
    if (!activeProject) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activeProject])

  useEffect(() => {
    if (!activeProject) return
    if (activeProject.modalLink) primaryBtnRef.current?.focus()
    else gotItBtnRef.current?.focus()
  }, [activeProject])

  useEffect(() => {
    if (!activeProject) return
    pushModalOpen()
    return () => popModalOpen()
  }, [activeProject])

  return (
    <>
    <section id="projects" className="py-32">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="03."
            title="Projects"
            subtitle="Things I've designed, built, and shipped."
          />
        </ScrollReveal>

        <div className="border-t border-rule">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={0.04 * i} className="border-b border-rule">
              <article
                role="button"
                tabIndex={0}
                onClick={() => setActiveProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveProject(project)
                  }
                }}
                className="group relative grid sm:grid-cols-[1fr_auto] gap-x-8 gap-y-2 items-start py-7 px-1 cursor-pointer transition-colors duration-[180ms] hover:bg-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink group-hover:text-paper transition-colors duration-[180ms]">
                    {project.name}
                  </h3>
                  <p className="text-sm mt-2 max-w-[60ch] text-ink/70 group-hover:text-paper/70 transition-colors duration-[180ms]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 font-mono text-[11px] uppercase tracking-wide text-muted group-hover:text-paper/60 transition-colors duration-[180ms]">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                    {project.statusBadge && <span>{project.statusBadge}</span>}
                  </div>
                  {project.statusNote && (
                    <p className="font-mono text-[11px] mt-1.5 text-muted group-hover:text-paper/50 transition-colors duration-[180ms]">
                      {project.statusNote}
                    </p>
                  )}
                </div>

                <div className="font-mono text-xs text-muted group-hover:text-paper/60 transition-colors duration-[180ms] sm:text-right whitespace-nowrap flex items-center gap-4 sm:justify-end">
                  <span>{project.role}</span>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-accent transition-colors"
                      aria-label={`${project.name} GitHub repository`}
                    >
                      git &#8599;
                    </a>
                  )}
                  {project.modalLink && <span aria-hidden="true">&#8599;</span>}
                </div>
              </article>
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
      <AnimatePresence>
        {activeProject && <ModalBackdrop key="project-overlay" onClick={close} />}
      </AnimatePresence>

      <AnimatePresence>
        {activeProject && (
          <ModalPanel
            key="project-modal"
            titleId="project-modal-title"
            title={activeProject.modalTitle}
            onClose={close}
          >
            <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line mb-8">
              {activeProject.modalBlurb}
            </p>

            {activeProject.modalLink ? (
              <p className="font-mono text-sm">
                <a
                  ref={primaryBtnRef}
                  href={activeProject.modalLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="text-accent underline underline-offset-4 hover:no-underline"
                >
                  {activeProject.modalLink.label} &#8599;
                </a>
                <span className="text-muted mx-3">or</span>
                <button onClick={close} className="text-ink underline underline-offset-4 hover:text-accent">
                  cancel
                </button>
              </p>
            ) : (
              <button
                ref={gotItBtnRef}
                onClick={close}
                className="font-mono text-sm text-accent underline underline-offset-4 hover:no-underline"
              >
                got it
              </button>
            )}
          </ModalPanel>
        )}
      </AnimatePresence>
    </ModalPortal>
    </>
  )
}

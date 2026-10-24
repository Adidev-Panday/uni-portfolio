'use client'
// Projects section: a mixed bento grid, not a uniform card grid and
// not a flat list. DriveSafe, AirflowNS, and StarsInMaine get bigger
// featured cells; the rest are smaller. Each cell inverts (PRIMARY
// background, --paper text) on hover with a subtle scale, giving each
// project its own tangible, clickable moment. Clicking anywhere opens
// a confirmation modal before navigating.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { projects, type Project } from '@/data/content'
import { pushModalOpen, popModalOpen } from '@/lib/modalDepth'
import { ModalBackdrop, ModalPanel } from './ModalPanel'
import ModalPortal from './ModalPortal'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

// Column span, minimum height, and title scale per cell: DriveSafe,
// AirflowNS, and StarsInMaine are the featured three (bigger, bolder);
// the rest sit smaller. Index-matched to the `projects` data array.
const BENTO_SPAN = ['md:col-span-4', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-3', 'md:col-span-3']
const BENTO_MIN_H = ['min-h-[260px]', 'min-h-[260px]', 'min-h-[200px]', 'min-h-[200px]', 'min-h-[200px]', 'min-h-[180px]', 'min-h-[180px]']
const FEATURED = [true, true, true, false, false, false, false]

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

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {projects.map((project, i) => {
            const span = BENTO_SPAN[i] ?? 'md:col-span-3'
            const minH = BENTO_MIN_H[i] ?? 'min-h-[180px]'
            const featured = FEATURED[i] ?? false
            return (
              <ScrollReveal key={project.name} delay={Math.min(i * 0.04, 0.2)} className={span}>
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
                  className={`group relative flex flex-col h-full ${minH} p-6 sm:p-8 border border-[color:var(--card-border)] rounded cursor-pointer transition-[background-color,color,border-color,border-width,transform] duration-150 hover:bg-accent hover:text-paper hover:border-2 hover:border-[color:var(--card-border-hover)] hover:scale-[1.01] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent`}
                >
                  {/* Top row: status badge + external indicator */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {project.demo && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent group-hover:text-paper transition-colors duration-150">
                        Live
                      </span>
                    )}
                    {project.statusBadge && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-paper/70 transition-colors duration-150">
                        {project.statusBadge}
                      </span>
                    )}
                    <span className="ml-auto font-mono text-sm text-muted group-hover:text-paper transition-colors duration-150" aria-hidden="true">
                      &#8599;
                    </span>
                  </div>

                  <h3 className={`font-serif text-ink group-hover:text-paper transition-colors duration-150 ${featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                    {project.name}
                  </h3>

                  <p className="text-sm mt-2 text-ink/70 group-hover:text-paper/80 transition-colors duration-150 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 font-mono text-[11px] uppercase tracking-wide text-muted group-hover:text-paper/60 transition-colors duration-150">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline underline-offset-4 transition-colors"
                        aria-label={`${project.name} GitHub repository`}
                      >
                        git &#8599;
                      </a>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
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

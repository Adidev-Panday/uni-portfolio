'use client'
// Projects section: responsive card grid with hover lift animation.
// Clicking anywhere on a card opens a confirmation modal before navigating.
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Github, ExternalLink, Lock, Info, X } from 'lucide-react'
import { projects, type Project } from '@/data/content'
import { modalCardAnim, pressTap, pressTransition, springUI } from '@/lib/motion'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

// Shared modal card animation (matches the admissions-officer popup)
const cardAnim = modalCardAnim

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const anchorBtnRef = useRef<HTMLAnchorElement>(null)
  const gotItBtnRef  = useRef<HTMLButtonElement>(null)

  const close = () => setActiveProject(null)

  // ESC key dismisses the open modal
  useEffect(() => {
    if (!activeProject) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activeProject])

  // Autofocus the primary action when the modal opens
  useEffect(() => {
    if (!activeProject) return
    if (activeProject.modalLink) anchorBtnRef.current?.focus()
    else gotItBtnRef.current?.focus()
  }, [activeProject])

  return (
    <section id="projects" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="03."
            title="Projects"
            subtitle="Things I've designed, built, and shipped."
          />
        </ScrollReveal>

        {/* 1-col mobile, 2-col tablet, 3-col desktop */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={0.07 * i}>
              <motion.article
                role="button"
                tabIndex={0}
                onClick={() => setActiveProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveProject(project)
                  }
                }}
                className="school-card group flex flex-col h-full p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-accent/40 transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                whileHover={{
                  y: -5,
                  boxShadow: '0 24px 48px -8px rgb(var(--accent-rgb) / 0.10)',
                }}
                transition={springUI}
              >
                {/* Card top row: initial icon + secondary link icons */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">
                      {project.name[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        aria-label={`${project.name} GitHub repository`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {/* Decorative redirect indicator; clicks fall through to the card */}
                    {project.modalLink && (
                      <ExternalLink
                        size={16}
                        className="text-zinc-400 group-hover:text-accent transition-colors"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>

                {/* Project name */}
                <h3 className="font-semibold text-[15px] mb-0.5 group-hover:text-accent transition-colors duration-200">
                  {project.name}
                </h3>

                {/* Role label */}
                <p className="text-xs text-accent/80 font-mono mb-3">{project.role}</p>

                {/* Description (flex-1 keeps the footer pinned to bottom) */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-5">
                  {project.description}
                </p>

                {/* Footer: tags, status badge, and status note */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* "Private / in progress" badge */}
                  {project.statusBadge && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                      <Lock size={9} />
                      {project.statusBadge}
                    </span>
                  )}

                  {/* Informational note (e.g. API keys expired) */}
                  {project.statusNote && (
                    <p className="flex items-start gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">
                      <Info size={11} className="mt-0.5 shrink-0 text-amber-400" />
                      {project.statusNote}
                    </p>
                  )}
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Confirmation modal: backdrop */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="project-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Confirmation modal: card */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="project-modal"
            {...cardAnim}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-8 pointer-events-auto">
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>

              <div className="text-center space-y-6 pt-1">
                <div className="space-y-2">
                  <h2
                    id="project-modal-title"
                    className="text-xl font-bold tracking-tight leading-snug"
                  >
                    {activeProject.modalLink
                      ? `Open ${activeProject.name}?`
                      : `${activeProject.name} isn't live right now`}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {activeProject.modalBlurb}
                  </p>
                </div>

                {activeProject.modalLink ? (
                  <div className="flex gap-3">
                    <motion.a
                      ref={anchorBtnRef}
                      href={activeProject.modalLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      whileTap={pressTap}
                      transition={pressTransition}
                      className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold bg-accent-fill text-white hover:opacity-90 transition-colors duration-150"
                    >
                      {activeProject.modalLink.label}
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
                ) : (
                  <motion.button
                    ref={gotItBtnRef}
                    onClick={close}
                    whileTap={pressTap}
                    transition={pressTransition}
                    className="w-full px-5 py-2.5 rounded-full text-sm font-semibold bg-accent-fill text-white hover:opacity-90 transition-colors duration-150"
                  >
                    Got it
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

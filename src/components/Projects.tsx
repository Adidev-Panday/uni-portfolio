'use client'
// Projects section: responsive card grid with hover lift animation.
import { motion } from 'motion/react'
import { Github, ExternalLink, BookOpen, Lock, Info } from 'lucide-react'
import { projects } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Projects() {
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
                className="school-card group flex flex-col h-full p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-accent/40 transition-colors duration-300 cursor-default"
                whileHover={{
                  y: -5,
                  boxShadow: '0 24px 48px -8px rgb(var(--accent-rgb) / 0.10)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {/* Card top row: initial icon + link icons */}
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
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-accent transition-colors"
                        aria-label={`${project.name} live demo`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.storyLink && (
                      <a
                        href={project.storyLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-accent transition-colors"
                        aria-label={project.storyLink.label}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookOpen size={16} />
                      </a>
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

                {/* Footer: tags, story link, status badge, and status note */}
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

                  {/* Story link as inline text */}
                  {project.storyLink && (
                    <a
                      href={project.storyLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.storyLink.label}
                      <ExternalLink size={10} />
                    </a>
                  )}

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
    </section>
  )
}

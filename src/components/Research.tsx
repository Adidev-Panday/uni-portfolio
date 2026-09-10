'use client'
// Research section — displays published papers as rich cards.
import { research } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'
import { ExternalLink, BookOpen } from 'lucide-react'

// Status → color mapping for the badge
const statusStyles: Record<string, string> = {
  published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  preprint: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'in review': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
}

export default function Research() {
  return (
    <section id="research" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="02."
            title="Research"
            subtitle="Published work and ongoing investigations."
          />
        </ScrollReveal>

        <div className="space-y-6">
          {research.map((paper, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)}>
              <div className="group p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                {/* Header row: status badge + paper link */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[paper.status] ?? statusStyles.published}`}
                  >
                    <BookOpen size={11} />
                    {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                  </span>

                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors shrink-0"
                  >
                    {paper.linkLabel}
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 group-hover:text-indigo-500 transition-colors duration-200">
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
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {paper.abstract}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

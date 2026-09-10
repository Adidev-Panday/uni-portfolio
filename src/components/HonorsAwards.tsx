'use client'
// Honors & Awards section — 2-column card grid.
import { honors } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'
import { Trophy } from 'lucide-react'

export default function HonorsAwards() {
  return (
    <section id="honors" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="05."
            title="Honors & Awards"
            subtitle="Recognition and achievements."
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {honors.map((honor, i) => (
            <ScrollReveal key={i} delay={0.08 * i}>
              <div className="group flex items-start gap-4 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 h-full">
                {/* Trophy icon */}
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Trophy size={14} className="text-amber-500" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-0.5 group-hover:text-indigo-500 transition-colors duration-200">
                    {honor.award}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-2 font-mono">
                    {honor.issuer}
                    <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
                    {honor.date}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {honor.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

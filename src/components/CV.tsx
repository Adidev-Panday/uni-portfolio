'use client'
// CV section: downloadable PDF placeholder.
// When cv.pdf is ready:
//   1. Drop cv.pdf into /public/
//   2. Replace the <button> below with:
//        <a href="/cv.pdf" download
//           className="inline-flex items-center gap-2 px-6 py-3 rounded-full
//                      text-sm font-medium bg-indigo-500 hover:bg-indigo-600
//                      text-white shadow-lg shadow-indigo-500/20
//                      transition-all duration-200 active:scale-95">
//          <Download size={15} /> Download CV
//        </a>
import { Download } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function CV() {
  return (
    <section id="cv" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="07."
            title="CV"
            subtitle="Curriculum Vitae"
          />
        </ScrollReveal>

        <div className="max-w-lg">
          <ScrollReveal delay={0.1}>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
              My full CV is a work in progress and will be available here soon as a downloadable PDF.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {/* Disabled placeholder button. See comment at top of file to activate. */}
            <button
              disabled
              aria-disabled="true"
              aria-label="CV download coming soon"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60 select-none"
            >
              <Download size={15} />
              Coming soon
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

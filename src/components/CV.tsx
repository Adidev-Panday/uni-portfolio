'use client'
// CV section: links out to /cv.pdf.
import { Download } from 'lucide-react'
import { motion } from 'motion/react'
import { cv } from '@/data/content'
import { pressTap, pressTransition } from '@/lib/motion'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function CV() {
  return (
    <section id="cv" className="py-24 min-h-[60vh]">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="06."
            title="CV"
            subtitle="Curriculum Vitae"
          />
        </ScrollReveal>

        <div className="max-w-lg">
          <ScrollReveal delay={0.1}>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
              {cv.body}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.a
              href="/cv.pdf"
              target="_blank"
              rel="noopener"
              whileTap={pressTap}
              transition={pressTransition}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-accent-fill text-white shadow-lg shadow-accent/20 hover:opacity-90 transition-colors duration-200"
            >
              <Download size={15} />
              {cv.buttonLabel}
            </motion.a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

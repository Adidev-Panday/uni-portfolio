'use client'
// CV section: one line of body copy, then a real (small) button for
// the download, not a huge pill. PRIMARY fill, inverts on hover.
import { Download } from 'lucide-react'
import { motion } from 'motion/react'
import { cv } from '@/data/content'
import { pressTap, pressTransition } from '@/lib/motion'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function CV() {
  return (
    <section id="cv" className="py-12">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="06." title="CV" subtitle="Curriculum Vitae" />
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <p className="text-ink/80 leading-relaxed max-w-xl mb-5">
            {cv.body}
          </p>

          <motion.a
            href={cv.pdfHref}
            target="_blank"
            rel="noopener"
            whileTap={pressTap}
            transition={pressTransition}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium border border-accent-fill bg-accent-fill text-accent-fill-text hover:bg-paper hover:text-accent-fill transition-colors duration-150"
          >
            <Download size={14} />
            {cv.buttonLabel}
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  )
}

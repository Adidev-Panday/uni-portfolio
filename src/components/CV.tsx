'use client'
// CV section: one sentence of body copy with the download as an inline
// underlined link, not a pill button taking up half the section.
import { cv } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function CV() {
  return (
    <section id="cv" className="py-12">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="06." title="CV" subtitle="Curriculum Vitae" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-ink/80 leading-relaxed max-w-xl">
            {cv.body}{' '}
            <a
              href={cv.pdfHref}
              target="_blank"
              rel="noopener"
              className="text-accent underline underline-offset-4 hover:no-underline"
            >
              {cv.buttonLabel} &#8599;
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

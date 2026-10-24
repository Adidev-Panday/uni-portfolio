'use client'
// About section: body copy only, no card. Uniform paragraph flow, no
// bold lead-in. The photo sits in its own column with a hairline
// border, no radius.
import Image from 'next/image'
import { about } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function About() {
  return (
    <section id="about" className="py-28">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="01." title={about.heading} subtitle={about.subtitle} />
        </ScrollReveal>

        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Profile photo: stacked polaroid / engineering-drawing frame.
              Three layers, each a plain div at the same size: a hairline
              rectangle at the back, a solid --primary block in the middle,
              and the photo itself (with its own matte border) on top. */}
          <ScrollReveal delay={0.05} className="md:col-span-4">
            <div className="relative aspect-square max-w-xs w-full">
              <div
                className="absolute inset-0 translate-x-[12px] translate-y-[12px] md:translate-x-4 md:translate-y-4 border"
                style={{ borderColor: 'var(--photo-hairline)' }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 translate-x-[6px] translate-y-[6px] md:translate-x-2 md:translate-y-2"
                style={{ backgroundColor: 'var(--primary)' }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 border border-rule bg-paper p-3 transition-transform duration-[180ms] ease-out hover:-translate-x-1 hover:-translate-y-1 active:-translate-x-1 active:-translate-y-1">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/profile.jpg"
                    alt="Adidev Panday"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bio: narrow editorial column, uniform body copy throughout */}
          <ScrollReveal delay={0.1} className="md:col-span-7 md:col-start-6">
            <div className="max-w-[60ch] space-y-5">
              {about.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-ink/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

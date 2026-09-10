'use client'
// About section — photo placeholder + bio paragraphs.
import { about } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function About() {
  return (
    <section id="about" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="01." title="About Me" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Avatar / photo placeholder */}
          <ScrollReveal delay={0.1}>
            <div className="aspect-square max-w-xs rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 dark:from-indigo-500/10 dark:to-violet-500/10 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center select-none">
              {/* Replace this div with an <Image> component once you have a photo:
                  import Image from 'next/image'
                  <Image src="/photo.jpg" alt="Adidev Panday" fill className="rounded-2xl object-cover" />
              */}
              <span className="text-7xl font-bold gradient-text" aria-label="Adidev Panday initials">
                AP
              </span>
            </div>
          </ScrollReveal>

          {/* Bio paragraphs */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-5 pt-2">
              {about.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-zinc-600 dark:text-zinc-400 leading-relaxed"
                >
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

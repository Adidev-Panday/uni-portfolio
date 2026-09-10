'use client'
// About section: profile photo + bio paragraphs.
import Image from 'next/image'
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
          {/* Profile photo */}
          <ScrollReveal delay={0.1}>
            <div className="aspect-square max-w-xs rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
              {/* To swap the photo: replace /profile.jpg with your new filename in /public */}
              <Image
                src="/profile.jpg"
                alt="Adidev Panday"
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
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

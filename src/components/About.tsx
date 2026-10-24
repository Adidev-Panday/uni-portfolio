'use client'
// About section: body copy only, no card. A large serif lead-in on the
// first sentence breaks the paragraph rhythm like a magazine pull-quote;
// the photo sits in its own column with a hairline border, no radius.
import Image from 'next/image'
import { about } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function About() {
  const [lead, ...restSentences] = about.paragraphs[0].split(/(?<=\.)\s+/)
  const rest = restSentences.join(' ')

  return (
    <section id="about" className="py-28">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="01." title={about.heading} subtitle={about.subtitle} />
        </ScrollReveal>

        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Profile photo: own column, no card chrome */}
          <ScrollReveal delay={0.1} className="md:col-span-4">
            <div className="aspect-square max-w-xs border border-rule overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Adidev Panday"
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </ScrollReveal>

          {/* Bio: narrow editorial column, serif lead-in on the opening line */}
          <ScrollReveal delay={0.2} className="md:col-span-7 md:col-start-6">
            <div className="max-w-[60ch] space-y-5">
              <p className="font-serif text-2xl sm:text-3xl text-ink leading-snug">
                {lead}
                {rest && <span className="font-sans text-base text-ink/80 leading-relaxed"> {rest}</span>}
              </p>
              {about.paragraphs.slice(1).map((paragraph, i) => (
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

'use client'
// Why Aerospace section -- always visible; personal origin story told as a
// bento grid where photos and paragraphs share rows instead of stacking.
// Content is data-driven via content.json (heading, paragraphs, photo alt text).
import Image from 'next/image'
import { whyAerospace } from '@/data/content'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

// School theme active: each photo is matte-framed in the school's own
// --primary color, a 4px --paper gap between border and image.
// No school theme: a plain hairline + an offset shadow built from
// --accent, lifting on hover instead of being school-branded.
const SCHOOL_CARD_CLASS =
  'relative overflow-hidden group border-[3px] border-[color:var(--primary)] p-1 bg-paper transition-[filter] duration-150 hover:brightness-110'
const DEFAULT_CARD_CLASS =
  'relative overflow-hidden group border border-[color:var(--photo-hairline)] shadow-[8px_8px_0_var(--photo-shadow)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_var(--photo-shadow)]'

export default function WhyAerospace() {
  const { schoolId } = useSchoolTheme()
  const cardClass = schoolId ? SCHOOL_CARD_CLASS : DEFAULT_CARD_CLASS
  const { heading, subtitle, paragraphs, photos } = whyAerospace

  return (
    <section id="why-aerospace" className="py-20">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="02." title={heading} subtitle={subtitle} />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Row 1: hero shot (Ferrari) + toy car, same row height */}
          <ScrollReveal delay={0.06} className="md:col-span-3">
            <div className={`${cardClass} aspect-video`}>
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                priority
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12} className="md:col-span-2">
            <div className={`${cardClass} aspect-video md:aspect-auto md:h-full`}>
              <Image
                src={photos[1].src}
                alt={photos[1].alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </ScrollReveal>

          {/* Row 2: first paragraph + lego photo */}
          <ScrollReveal delay={0.06} className="md:col-span-3 flex items-center">
            <p className="leading-relaxed text-ink/80 max-w-[60ch]">
              {paragraphs[0]}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06} className="md:col-span-2">
            <div className={`${cardClass} aspect-video md:aspect-auto md:h-full md:min-h-[220px]`}>
              <Image
                src={photos[2].src}
                alt={photos[2].alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </ScrollReveal>

          {/* Row 3: second paragraph + toy bike & robotics side by side */}
          <ScrollReveal delay={0.06} className="md:col-span-3 flex items-center">
            <p className="leading-relaxed text-ink/80 max-w-[60ch]">
              {paragraphs[1]}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.06} className="md:col-span-2">
            <div className="grid grid-cols-2 gap-5 md:h-full md:min-h-[220px]">
              {photos.slice(3).map((photo, i) => (
                <div key={i} className={`${cardClass} aspect-square md:aspect-auto md:h-full`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 20vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

'use client'
// Why Aerospace section -- always visible; personal origin story with photo gallery.
// Content is data-driven via content.json (heading, paragraphs, photo alt text).
import Image from 'next/image'
import { whyAerospace } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function WhyAerospace() {
  const { heading, subtitle, paragraphs, photos } = whyAerospace

  return (
    <section id="why-aerospace" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="02." title={heading} subtitle={subtitle} />
        </ScrollReveal>

        {/* Photo gallery: featured first image + 4 square thumbnails */}
        <ScrollReveal delay={0.08}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14">
            {/* Photo 1: Ferrari -- featured, spans 2 cols */}
            <div className="col-span-2 relative aspect-video rounded-xl overflow-hidden group shadow-md border border-zinc-200 dark:border-zinc-800">
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(min-width: 768px) 66vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
              <p className="absolute bottom-2.5 left-3 text-[11px] text-white/80 font-mono leading-tight">
                {photos[0].alt}
              </p>
            </div>

            {/* Photo 2: Toy car -- fills col 3 on desktop, starts new row on mobile */}
            <div className="relative aspect-video md:aspect-auto rounded-xl overflow-hidden group shadow-md border border-zinc-200 dark:border-zinc-800">
              <Image
                src={photos[1].src}
                alt={photos[1].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
              <p className="absolute bottom-2.5 left-2.5 text-[11px] text-white/80 font-mono leading-tight">
                {photos[1].alt}
              </p>
            </div>

            {/* Photos 3-5: square thumbnails across the second row */}
            {photos.slice(2).map((photo, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden group shadow-md border border-zinc-200 dark:border-zinc-800"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
                <p className="absolute bottom-2.5 left-2.5 text-[11px] text-white/80 font-mono leading-tight">
                  {photo.alt}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Copy paragraphs */}
        <div className="max-w-2xl space-y-5">
          {paragraphs.map((paragraph, i) => {
            const isNote = i === paragraphs.length - 1
            return (
              <ScrollReveal key={i} delay={0.06 * i}>
                <p
                  className={`leading-relaxed ${
                    isNote
                      ? 'text-sm text-zinc-400 dark:text-zinc-500 italic'
                      : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {paragraph}
                </p>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

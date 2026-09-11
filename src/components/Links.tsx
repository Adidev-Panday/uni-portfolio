'use client'
// Links / Profiles section — prominent gradient link cards.
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { profileLinks } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Links() {
  return (
    <section id="links" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="07."
            title="Find Me Online"
            subtitle="Where I write, build, and connect."
          />
        </ScrollReveal>

        {/* Responsive grid: 1 → 2 → 4 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profileLinks.map((link, i) => (
            <ScrollReveal key={link.label} delay={0.1 * i}>
              <motion.a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`links-card group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br ${link.gradient} min-h-[148px] overflow-hidden`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {/* Top: platform label + arrow */}
                <div className="flex items-center justify-between mb-auto">
                  <span className="text-white/50 text-xs font-mono tracking-widest uppercase">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                  />
                </div>

                {/* Bottom: handle */}
                <p className="text-white font-semibold text-lg leading-snug mt-4">
                  {link.handle}
                </p>

                {/* Decorative background circle */}
                <span
                  className="pointer-events-none absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/5"
                  aria-hidden
                />
              </motion.a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'
// Contact section — email CTA + social links.
import { Mail, ArrowUpRight } from 'lucide-react'
import { contact } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="08." title="Get In Touch" />
        </ScrollReveal>

        <div className="max-w-2xl">
          {/* Tagline */}
          <ScrollReveal delay={0.1}>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
              {contact.tagline}
            </p>
          </ScrollReveal>

          {/* Email button — the main CTA */}
          <ScrollReveal delay={0.2}>
            <a
              href={`mailto:${contact.email}`}
              className="group inline-flex items-center gap-3 text-xl sm:text-2xl font-semibold hover:text-accent transition-colors duration-200 mb-12"
            >
              <Mail
                size={26}
                className="text-accent group-hover:scale-110 transition-transform duration-200"
              />
              {contact.email}
              <ArrowUpRight
                size={20}
                className="text-zinc-400 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200"
              />
            </a>
          </ScrollReveal>

          {/* Secondary social links */}
          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-6">
              {contact.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-accent transition-colors duration-200"
                >
                  {s.label}
                  <ArrowUpRight
                    size={12}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  />
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

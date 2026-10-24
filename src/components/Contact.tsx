'use client'
// Contact section: a tagline sentence, then one mono line -- email as
// a mailto link, social links inline beside it.
import { contact } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader number="07." title="Get In Touch" />
        </ScrollReveal>

        <div className="max-w-xl">
          <ScrollReveal delay={0.06}>
            <p className="text-ink/80 leading-relaxed mb-6">
              {contact.tagline}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <p className="font-mono text-base">
              <a
                href={`mailto:${contact.email}`}
                className="text-accent underline underline-offset-4 hover:no-underline"
              >
                {contact.email}
              </a>
              {contact.social.map((s) => (
                <span key={s.label}>
                  <span className="text-muted mx-3">/</span>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline underline-offset-4 hover:text-accent"
                  >
                    {s.label.toLowerCase()} &#8599;
                  </a>
                </span>
              ))}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

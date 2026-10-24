'use client'
// Links / Profiles section: a mono terminal readout, not colored
// gradient cards. Each row reads LABEL / arrow / handle / domain.
import { profileLinks } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export default function Links() {
  return (
    <section id="links" className="py-16">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="05."
            title="Find Me Online"
            subtitle="Where I write, build, and connect."
          />
        </ScrollReveal>

        <div className="border-t border-rule font-mono text-sm">
          {profileLinks.map((link) => (
            <ScrollReveal key={link.label} className="border-b border-rule">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[88px_20px_1fr] sm:grid-cols-[140px_24px_1fr_auto] items-baseline gap-x-4 py-4 px-1 transition-colors duration-150 hover:bg-ink"
              >
                <span className="uppercase tracking-wide text-muted group-hover:text-paper/60 transition-colors duration-150">
                  {link.label}
                </span>
                <span className="text-muted group-hover:text-accent transition-colors duration-150">
                  &#8599;
                </span>
                <span className="text-ink group-hover:text-paper truncate transition-colors duration-150">
                  {link.handle}
                </span>
                <span className="hidden sm:inline text-xs text-muted group-hover:text-paper/50 justify-self-end transition-colors duration-150">
                  {hostname(link.href)}
                </span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

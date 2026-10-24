'use client'
// Links / Profiles section: a row of editorial card buttons, not a
// terminal readout, not colored gradients. Four across on desktop,
// stacked on mobile.
import { profileLinks } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profileLinks.map((link, i) => (
            <ScrollReveal key={link.label} delay={Math.min(i * 0.06, 0.18)}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between min-h-[160px] p-6 rounded border border-rule bg-paper hover:bg-accent hover:border-accent transition-colors duration-150"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted group-hover:text-paper transition-colors duration-150">
                    {link.label}
                  </span>
                  <span className="font-mono text-sm text-muted group-hover:text-paper transition-colors duration-150">
                    &#8599;
                  </span>
                </div>
                <p className="font-serif text-xl text-ink group-hover:text-paper transition-colors duration-150 mt-6">
                  {link.handle}
                </p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

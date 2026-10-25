'use client'
// "Why [School]" section -- visible only when an admissions officer has selected
// their institution. Animates in/out as the school theme changes.
import { motion, AnimatePresence } from 'motion/react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { whySchool, type WhySchoolEntry } from '@/data/content'
import { springUI } from '@/lib/motion'
import ScrollReveal from './ScrollReveal'
import { PrincetonTigerButton, PrincetonMottoLine } from './PrincetonEasterEggs'
import PrincetonCinematicOpener from './PrincetonCinematicOpener'
import PrincetonSumOverPaths from './PrincetonSumOverPaths'
import PrincetonClock from './PrincetonClock'
import { VeritasShield, HarvardMottoLine } from './HarvardEasterEggs'
import { BerkeleyTimeTip, FortyBall, FiatLuxBlock, OskiTrigger } from './BerkeleyEasterEggs'
import { MottoLine } from './SchoolMotif'

const BESPOKE_SCHOOLS = new Set(['princeton', 'harvard', 'uc-berkeley'])

function fillTemplate(entry: WhySchoolEntry, name: string): WhySchoolEntry {
  const fill = (s: string) => s.replace(/\{school\}/g, name)
  return {
    opener: fill(entry.opener),
    bullets: entry.bullets.map(fill) as WhySchoolEntry['bullets'],
    pullQuote: entry.pullQuote ? fill(entry.pullQuote) : undefined,
  }
}

export default function WhySchool() {
  const { school } = useSchoolTheme()

  const entry: WhySchoolEntry | null = school
    ? fillTemplate(whySchool.schools[school.id] ?? whySchool.defaultTemplate, school.name)
    : null

  return (
    <AnimatePresence>
      {school && entry && (
        <motion.div
          key="why-school-wrapper"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={springUI}
          className="overflow-hidden"
        >
          <section id="why-school" className="py-24">
            <div className="section-container">
              <ScrollReveal>
                <div className="mb-10">
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="font-mono text-xs text-muted tracking-widest shrink-0">00.</span>
                    <div className="h-px flex-1 bg-rule" />
                  </div>
                  <h2 className="font-serif text-ink text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] tracking-[-0.02em] inline-block">
                    Why {school.name}?
                  </h2>
                  {school.id === 'princeton' && <PrincetonTigerButton />}
                  {school.id === 'harvard' && <VeritasShield />}
                  {school.id === 'uc-berkeley' && (
                    <>
                      <BerkeleyTimeTip />
                      <FortyBall />
                      <OskiTrigger />
                    </>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {school.id === 'princeton' && (
              <div className="mb-14">
                <PrincetonCinematicOpener />
              </div>
            )}

            <div className="section-container">
              {school.id === 'princeton' && (
                <div className="mb-16">
                  <PrincetonSumOverPaths />
                </div>
              )}

              <ScrollReveal delay={0.06}>
                <div className="max-w-[65ch]">
                  <p className="font-serif italic text-muted text-base sm:text-lg leading-relaxed mb-10">
                    {entry.opener}
                  </p>
                  {entry.pullQuote && (
                    <p
                      className="font-serif italic text-muted/60 border-l-2 border-accent pl-6 mb-10"
                      style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.2 }}
                    >
                      {entry.pullQuote}
                    </p>
                  )}
                  <ul>
                    {entry.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className={`flex gap-5 py-6 ${i > 0 ? 'border-t border-rule' : ''}`}
                      >
                        <span className="font-mono text-sm text-accent shrink-0" aria-hidden="true">
                          0{i + 1}.
                        </span>
                        <span className="text-[1.25rem] text-ink/80 leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {school.id === 'princeton' && <PrincetonMottoLine />}
                  {school.id === 'harvard' && <HarvardMottoLine />}
                  {school.id === 'uc-berkeley' && <FiatLuxBlock />}
                  {!BESPOKE_SCHOOLS.has(school.id) && <MottoLine schoolId={school.id} />}
                </div>
              </ScrollReveal>

              {school.id === 'princeton' && (
                <div className="mt-14">
                  <PrincetonClock />
                </div>
              )}
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

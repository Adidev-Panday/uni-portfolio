'use client'
// "Why [School]" section -- visible only when an admissions officer has selected
// their institution. Animates in/out as the school theme changes.
import { motion, AnimatePresence } from 'motion/react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { whySchool } from '@/data/content'
import { springUI } from '@/lib/motion'
import ScrollReveal from './ScrollReveal'
import { PrincetonTigerButton, PrincetonMottoLine } from './PrincetonEasterEggs'
import { VeritasShield, HarvardMottoLine } from './HarvardEasterEggs'
import { BerkeleyTimeTip, FortyBall, FiatLuxBlock } from './BerkeleyEasterEggs'

export default function WhySchool() {
  const { school } = useSchoolTheme()

  const text = school
    ? (whySchool.schools[school.id] ||
       whySchool.defaultTemplate.replace(/{school}/g, school.name))
    : ''

  return (
    <AnimatePresence>
      {school && (
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
                    </>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06}>
                <div className="max-w-[65ch] space-y-4">
                  {text.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base sm:text-lg text-ink/80 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {school.id === 'princeton' && <PrincetonMottoLine />}
                  {school.id === 'harvard' && <HarvardMottoLine />}
                  {school.id === 'uc-berkeley' && <FiatLuxBlock />}
                </div>
              </ScrollReveal>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

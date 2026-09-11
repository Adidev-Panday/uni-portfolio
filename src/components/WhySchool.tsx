'use client'
// "Why [School]" section -- visible only when an admissions officer has selected
// their institution. Animates in/out as the school theme changes.
import { motion, AnimatePresence } from 'motion/react'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { whySchool } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import { PrincetonTigerButton, PrincetonMottoLine } from './PrincetonEasterEggs'

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
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <section id="why-school" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="section-container">
              <ScrollReveal>
                <div className="mb-10">
                  <span className="text-accent font-mono text-sm tracking-widest">
                    00.
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mt-2 mb-3 gradient-text inline-block">
                    Why {school.name}?
                  </h2>
                  {school.id === 'princeton' && <PrincetonTigerButton />}
                  <div className="h-px w-16 mt-1 accent-gradient-bar" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="max-w-2xl">
                  <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {text}
                  </p>
                  {school.id === 'princeton' && <PrincetonMottoLine />}
                </div>
              </ScrollReveal>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

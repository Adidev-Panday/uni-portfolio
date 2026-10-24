'use client'
// Hero section: full-viewport first impression.
// Background: /public/background.jpg, with a single vertical wash from
// transparent (top) to --paper (bottom) so the text block sits on a
// seamless transition straight into the first section -- no scrim box,
// no ambient color blobs.
import Image from 'next/image'
import { motion } from 'motion/react'
import { hero } from '@/data/content'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { PrincetonClassTag } from './PrincetonEasterEggs'
import { HarvardClassTag } from './HarvardEasterEggs'
import { BerkeleyClassTag } from './BerkeleyEasterEggs'

const BESPOKE_SCHOOLS = ['princeton', 'harvard', 'uc-berkeley']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
})

export default function Hero() {
  const { schoolId } = useSchoolTheme()

  const projectsHref = hero.ctas.find((c) => c.primary)?.href ?? '#projects'
  const researchHref = hero.ctas.find((c) => c.label.toLowerCase().includes('research'))?.href ?? '#research'
  const aerospaceHref = hero.ctas.find((c) => c.label.toLowerCase().includes('aerospace'))?.href ?? '#why-aerospace'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Background photo */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        {/* Single wash, both modes: transparent for the top ~40%, resolving
            to solid --paper by the bottom, so the text sits on paper and
            blends straight into the next section. */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 38%, var(--paper) 92%)',
          }}
        />
      </div>

      {/* Content block: anchored bottom-left, not centered */}
      <div className="relative section-container w-full pb-20 pt-40 md:max-w-[60vw]">
        {schoolId && BESPOKE_SCHOOLS.includes(schoolId) && (
          <motion.div className="mb-4" {...fadeUp(0.05)}>
            {schoolId === 'princeton' && <PrincetonClassTag />}
            {schoolId === 'harvard' && <HarvardClassTag />}
            {schoolId === 'uc-berkeley' && <BerkeleyClassTag />}
          </motion.div>
        )}

        <motion.h1
          className="font-serif text-ink text-[clamp(4rem,10vw,10rem)] leading-[0.95] tracking-[-0.03em] mb-6"
          {...fadeUp(0.1)}
        >
          {hero.name}
        </motion.h1>

        <motion.p
          className="text-ink text-lg sm:text-xl max-w-xl mb-6 leading-relaxed"
          {...fadeUp(0.2)}
        >
          An aspiring aerospace engineer: F1 aerodynamics, propulsion, and the physics of making a thing move.
        </motion.p>

        <motion.p className="text-base" {...fadeUp(0.3)}>
          <a
            href={projectsHref}
            className="text-accent font-medium underline underline-offset-4 hover:no-underline"
          >
            View projects <span className="font-mono">&#8599;</span>
          </a>
          <span className="text-muted mx-3">or</span>
          <a href={researchHref} className="text-ink underline underline-offset-4 hover:text-accent">
            read research
          </a>
          <span className="text-muted mx-2">/</span>
          <a href={aerospaceHref} className="text-ink underline underline-offset-4 hover:text-accent">
            why aerospace
          </a>
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        aria-hidden
      >
        SCROLL &#8595;
      </motion.div>
    </section>
  )
}

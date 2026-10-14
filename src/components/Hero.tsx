'use client'
// Hero section: full-viewport first impression.
// Background: /public/background.jpg at low opacity behind a dark overlay.
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { hero } from '@/data/content'
import { pressTap, pressTransition } from '@/lib/motion'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { PrincetonClassTag } from './PrincetonEasterEggs'
import { HarvardClassTag } from './HarvardEasterEggs'
import { BerkeleyClassTag } from './BerkeleyEasterEggs'

const BESPOKE_SCHOOLS = ['princeton', 'harvard', 'uc-berkeley']

// Reusable entrance animation config
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
})

export default function Hero() {
  const { schoolId } = useSchoolTheme()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Layer 1 (-z-20): background photo.
          Dark mode keeps the original full-hero tint (already reads well).
          Light mode has no full-hero wash at all: the photo stays fully
          visible, and legibility instead comes from the frosted panel
          behind the text column below. */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark mode: unchanged flat tint + top-fade gradient */}
        <div className="hidden dark:block absolute inset-0 bg-[#09090b]/[0.81]" />
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-[#09090b]/50 via-transparent to-transparent" />
      </div>

      {/* Layer 2 (-z-10): soft ambient blobs, colour driven by CSS custom properties */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-secondary/[0.06] rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </motion.div>

      {/* Content */}
      <div className="section-container py-32 relative">
        {/* Light-mode-only frosted panel behind the text column. Sized via
            negative inset off this same (relative) container, so it always
            matches the text's own box with no manual coordinate guessing,
            then padded outward a little for breathing room. Dark mode
            already reads correctly from the full-hero tint above, so this
            is hidden there. */}
        <div className="dark:hidden absolute inset-x-0 -top-8 -bottom-8 max-w-3xl bg-white/75 backdrop-blur-2xl rounded-[2rem] shadow-xl shadow-black/5" />

        {/* Text content: `relative` so it stacks above the panel (an
            absolutely-positioned sibling would otherwise paint on top of
            static content regardless of DOM order). */}
        <div className="relative">
          {/* Greeting */}
          <motion.span
            className="inline-block text-accent font-mono text-sm tracking-widest mb-5"
            {...fadeUp(0.05)}
          >
            {hero.greeting}
          </motion.span>

          {/* Class tag, bespoke theme schools only */}
          {schoolId && BESPOKE_SCHOOLS.includes(schoolId) && (
            <motion.div className="mb-5" {...fadeUp(0.1)}>
              {schoolId === 'princeton' && <PrincetonClassTag />}
              {schoolId === 'harvard' && <HarvardClassTag />}
              {schoolId === 'uc-berkeley' && <BerkeleyClassTag />}
            </motion.div>
          )}

          {/* Name: large gradient heading, colours driven by CSS custom properties */}
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-[90px] font-bold tracking-tighter leading-[1.02] mb-6"
            {...fadeUp(0.15)}
          >
            <span className="gradient-text">{hero.name}</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg sm:text-xl text-zinc-900 dark:text-zinc-300 max-w-2xl mb-4 leading-relaxed font-medium"
            {...fadeUp(0.25)}
          >
            {hero.tagline}
          </motion.p>

          {/* Intro blurb */}
          <motion.p
            className="text-base text-zinc-800 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed"
            {...fadeUp(0.35)}
          >
            {hero.intro}
          </motion.p>

          {/* CTA buttons */}
          <motion.div className="flex flex-wrap gap-4" {...fadeUp(0.45)}>
            {hero.ctas.map(({ label, href, primary }) => (
              <motion.a
                key={label}
                href={href}
                whileTap={pressTap}
                transition={pressTransition}
                className={
                  primary
                    ? 'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-accent-fill text-white shadow-lg shadow-accent/20 hover:opacity-90 transition-colors duration-200'
                    : 'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-transparent text-zinc-800 dark:text-zinc-300 hover:border-accent hover:text-accent transition-colors duration-200'
                }
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-600 dark:text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  )
}

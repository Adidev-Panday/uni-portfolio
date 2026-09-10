'use client'
// Hero section: full-viewport first impression.
// Background: /public/background.jpg at low opacity behind a dark overlay.
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { hero } from '@/data/content'

// Reusable entrance animation config
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Layer 1 (-z-20): background photo + semi-transparent overlay
          The overlay is tuned so roughly 15-20% of the image is visible.
          Adjust the opacity values here to taste. */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        {/* Light mode: white at 83% opacity keeps image faintly visible.
            Dark mode: near-black at 81% opacity for the same effect. */}
        <div className="absolute inset-0 bg-white/[0.83] dark:bg-[#09090b]/[0.81]" />
        {/* Bottom-up gradient adds extra contrast where the text lives */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-[#09090b]/50 dark:via-transparent dark:to-transparent" />
      </div>

      {/* Layer 2 (-z-10): soft ambient blobs (very subtle on top of photo overlay) */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-500/6 rounded-full blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </motion.div>

      {/* Content */}
      <div className="section-container py-32">
        {/* Greeting */}
        <motion.span
          className="inline-block text-indigo-500 font-mono text-sm tracking-widest mb-5"
          {...fadeUp(0.05)}
        >
          {hero.greeting}
        </motion.span>

        {/* Name -- large gradient heading */}
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-[90px] font-bold tracking-tighter leading-[1.02] mb-6"
          {...fadeUp(0.15)}
        >
          <span className="gradient-text">{hero.name}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mb-4 leading-relaxed font-medium"
          {...fadeUp(0.25)}
        >
          {hero.tagline}
        </motion.p>

        {/* Intro blurb */}
        <motion.p
          className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed"
          {...fadeUp(0.35)}
        >
          {hero.intro}
        </motion.p>

        {/* CTA buttons */}
        <motion.div className="flex flex-wrap gap-4" {...fadeUp(0.45)}>
          {hero.ctas.map(({ label, href, primary }) => (
            <a
              key={label}
              href={href}
              className={
                primary
                  ? 'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95'
                  : 'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:scale-95'
              }
            >
              {label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-400"
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

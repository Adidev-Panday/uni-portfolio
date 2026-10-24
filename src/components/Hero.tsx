'use client'
// Hero section: a 60/40 split. Left column is typography on --paper/
// --ink (the real hero visual, not an overlay); right column is the
// photo as a tall vertical panel with a hairline border, not a
// full-bleed background. On mobile the columns stack: text on top,
// a 60vh photo band below.
//
// Three kinetic moments, all gated behind prefers-reduced-motion:
//   1. Scroll-reactive weight: the name's Fraunces wght/SOFT axes
//      track scroll position via a CSS scroll-driven animation
//      (animation-timeline: scroll()), with a rAF fallback for
//      browsers that don't support it yet (Safari).
//   2. Cursor-reactive tracking: letter-spacing on the name shifts
//      with horizontal cursor position, desktop pointer devices only.
//   3. Entrance reveal: the name mask-reveals letter by letter on
//      first paint, then the rest of the content cascades in.
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { hero } from '@/data/content'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'
import { SCHOOL_CLASS_TAGS } from '@/data/schoolClassTags'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
})

export default function Hero() {
  const { schoolId } = useSchoolTheme()
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  const classTag = schoolId ? SCHOOL_CLASS_TAGS[schoolId] : undefined

  const projectsHref = hero.ctas.find((c) => c.primary)?.href ?? '#projects'
  const researchHref = hero.ctas.find((c) => c.label.toLowerCase().includes('research'))?.href ?? '#research'
  const aerospaceHref = hero.ctas.find((c) => c.label.toLowerCase().includes('aerospace'))?.href ?? '#why-aerospace'

  // Kinetic moment 2: cursor-reactive tracking, desktop pointer only.
  useEffect(() => {
    if (prefersReducedMotion) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 768) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const t = Math.min(Math.max(e.clientX / window.innerWidth, 0), 1)
        const tracking = -0.04 + t * 0.03 // -0.04em far left -> -0.01em far right
        if (nameRef.current) nameRef.current.style.letterSpacing = `${tracking}em`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [prefersReducedMotion])

  // Kinetic moment 1: scroll-reactive weight. CSS scroll-timeline
  // handles this natively where supported (see .hero-name in
  // globals.css); this effect only runs the rAF fallback where it
  // isn't (Safari), driving the same --hero-wght/--hero-soft custom
  // properties the CSS rule already reads.
  useEffect(() => {
    if (prefersReducedMotion) return
    if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()')) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const heroHeight = sectionRef.current?.offsetHeight ?? window.innerHeight
        const p = Math.min(Math.max(window.scrollY / heroHeight, 0), 1)
        const wght = 300 + p * 400
        const soft = 30 + p * 70
        nameRef.current?.style.setProperty('--hero-wght', String(wght))
        nameRef.current?.style.setProperty('--hero-soft', String(soft))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [prefersReducedMotion])

  // Split into words, not a flat character list: each word gets its
  // own non-wrapping box so the only valid line break is the real
  // space between "Adidev" and "Panday" (used below 768px), never a
  // break mid-word. The per-letter mask reveal still runs within
  // each word. The space itself is rendered OUTSIDE any nowrap box,
  // as a plain sibling, so it stays the one real break opportunity.
  const words = hero.name.split(' ')

  return (
    <section id="hero" ref={sectionRef} className="relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:h-screen">
        {/* LEFT: typography column, 60% on desktop */}
        <div className="relative flex flex-col justify-center bg-paper md:w-[60%] px-6 sm:px-10 md:pl-[6vw] md:pr-12 py-24 md:py-0">
          {classTag && (
            <motion.div className="mb-5" {...fadeUp(0)}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm px-3 py-1 text-[11px] font-medium tracking-wide text-accent">
                {classTag}
              </span>
            </motion.div>
          )}

          <h1
            ref={nameRef}
            className="hero-name font-serif text-ink text-[clamp(3.5rem,8vw,9rem)] leading-[1.0] tracking-[-0.03em] mb-6"
            style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}
          >
            {words.flatMap((word, wi) => {
              const wordSpan = (
                <span key={`w${wi}`} className="whitespace-nowrap">
                  {Array.from(word).map((ch, i) => (
                    <span key={i} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={prefersReducedMotion ? undefined : { y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.5, delay: 0.1 + (wi * word.length + i) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                </span>
              )
              return wi < words.length - 1 ? [wordSpan, ' '] : [wordSpan]
            })}
          </h1>

          <motion.p
            className="text-ink text-[1.25rem] max-w-xl mb-7 leading-relaxed"
            {...fadeUp(0.8)}
          >
            An aspiring aerospace engineer: F1 aerodynamics, propulsion, and the physics of making a thing move.
          </motion.p>

          <motion.p className="text-base" {...fadeUp(0.95)}>
            <a
              href={projectsHref}
              className="group text-accent font-medium underline underline-offset-4 hover:no-underline"
            >
              View projects
              <span className="inline-block ml-1 font-mono transition-transform duration-200 group-hover:translate-x-1">
                &#8599;
              </span>
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

          {/* Scroll hint: a single breathing hairline, no text */}
          <div
            className="hero-scroll-pulse hidden md:block absolute bottom-10 left-6 sm:left-8 lg:left-[6vw]"
            aria-hidden="true"
          />
        </div>

        {/* RIGHT: photo panel, 40% on desktop, full-width band on mobile */}
        <div className="relative w-full h-[60vh] md:h-auto md:w-[40%] border-t md:border-t-0 md:border-l border-rule">
          <Image
            src="/background.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[center_30%]"
          />
          <p className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest uppercase text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
            Isle of Skye, Scotland / 2026
          </p>
        </div>
      </div>
    </section>
  )
}

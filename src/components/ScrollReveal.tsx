'use client'
// Reusable scroll-triggered reveal wrapper. Opacity + a 12px translateY
// instead of a clip-path mask: both are compositor-only properties, so
// this stays smooth on weaker hardware where clip-path judders.
// will-change is toggled on only while the animation is actually
// running, so it doesn't sit on every revealed element forever.
import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number // stagger delay in seconds
  className?: string
}

export default function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null)
  // Positive bottom margin: the element is treated as "in view" while
  // still below the fold, so the reveal finishes by the time the user
  // actually scrolls to it instead of starting late.
  const isInView = useInView(ref, { once: true, margin: '0px 0px 120px 0px' })
  const [animating, setAnimating] = useState(false)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: animating ? 'transform, opacity' : 'auto' }}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
    >
      {children}
    </motion.div>
  )
}

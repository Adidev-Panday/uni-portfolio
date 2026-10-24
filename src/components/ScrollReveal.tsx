'use client'
// Reusable scroll-triggered reveal wrapper. A mask reveal (clip-path
// from bottom to top) instead of a fade-up: text looks like it's being
// uncovered, not animating in from nowhere. Plays once per element.
import { useRef } from 'react'
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
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
      animate={isInView ? { clipPath: 'inset(0% 0 0 0)', opacity: 1 } : {}}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

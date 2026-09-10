'use client'
// Reusable scroll-triggered reveal wrapper.
// Wraps any content with a fade-up (or fade-left) animation
// that plays once when the element enters the viewport.
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number // stagger delay in seconds
  className?: string
  direction?: 'up' | 'left' | 'none'
}

export default function ScrollReveal({
  children,
  delay = 0,
  className,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef(null)
  // once: true — animation only plays the first time the element enters view
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 32 : 0,
    x: direction === 'left' ? -32 : 0,
  }

  const animate = isInView
    ? { opacity: 1, y: 0, x: 0 }
    : initial

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // custom ease — feels natural
      }}
    >
      {children}
    </motion.div>
  )
}

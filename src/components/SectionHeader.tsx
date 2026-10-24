'use client'
// Shared section header: mono eyebrow (number + hairline rule that
// draws in left-to-right on scroll), then a large serif title, then an
// optional mono metadata line. Used at the top of every section. The
// rule draws in via transform: scaleX (compositor-only, no layout or
// paint cost), not a clip-path or width animation.
import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface SectionHeaderProps {
  number?: string  // e.g. "01." (omit to hide the number label)
  title: string
  subtitle?: string
}

export default function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  const ruleRef = useRef(null)
  // Positive bottom margin so the rule starts drawing in slightly
  // before the header actually reaches the viewport.
  const ruleInView = useInView(ruleRef, { once: true, margin: '0px 0px 120px 0px' })
  const [animating, setAnimating] = useState(false)

  return (
    <div className="mb-12 section-header">
      {number && (
        <div className="flex items-baseline gap-4 mb-5">
          <span className="font-mono text-xs text-muted tracking-widest shrink-0">
            {number}
          </span>
          <div className="h-px flex-1 overflow-hidden" ref={ruleRef}>
            <motion.div
              className="h-full bg-rule origin-left"
              style={{ willChange: animating ? 'transform' : 'auto' }}
              initial={{ scaleX: 0 }}
              animate={ruleInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onAnimationStart={() => setAnimating(true)}
              onAnimationComplete={() => setAnimating(false)}
            />
          </div>
        </div>
      )}
      <h2 className="font-serif text-ink text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] tracking-[-0.02em]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-mono text-xs text-muted mt-3 tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  )
}

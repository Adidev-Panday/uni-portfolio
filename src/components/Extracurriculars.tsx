'use client'
// Extracurriculars section — animated accordion list.
// Click any item to expand its description; click again to collapse.
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Calendar } from 'lucide-react'
import { extracurriculars } from '@/data/content'
import ScrollReveal from './ScrollReveal'
import SectionHeader from './SectionHeader'

export default function Extracurriculars() {
  // Track which item is expanded; null = all collapsed
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="extracurriculars" className="py-24">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            number="04."
            title="Extracurriculars"
            subtitle="Clubs, societies, leadership roles, and activities beyond the classroom."
          />
        </ScrollReveal>

        <div className="space-y-2">
          {extracurriculars.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <ScrollReveal key={i} delay={0.04 * i}>
                <div
                  className={`rounded-xl border transition-colors duration-300 ${
                    isOpen
                      ? 'border-accent/40'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {/* Accordion trigger */}
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.role}</p>
                      <p className="text-zinc-500 text-sm truncate">{item.organization}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Grade range — hidden on very small screens */}
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                        <Calendar size={11} />
                        {item.grades}
                      </span>

                      {/* Chevron — rotates when open */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown
                          size={16}
                          className={isOpen ? 'text-accent' : 'text-zinc-400'}
                        />
                      </motion.div>
                    </div>
                  </button>

                  {/* Animated expandable body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          {/* Grade range on mobile */}
                          <p className="sm:hidden flex items-center gap-1.5 text-xs text-zinc-400 font-mono mb-3">
                            <Calendar size={11} />
                            {item.grades}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

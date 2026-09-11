'use client'
// Sticky top navbar.
// - Transparent when at top, frosted-glass blur when scrolled.
// - Highlights the active section using IntersectionObserver.
// - Collapses to a hamburger menu on mobile.
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { navLinks, meta } from '@/data/content'
import ThemeToggle from './ThemeToggle'
import { useSchoolTheme } from '@/hooks/useSchoolTheme'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { school } = useSchoolTheme()

  // Show background/blur once page is scrolled past 24px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which section is currently in view
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      data-scrolled={scrolled}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / logo */}
        <a
          href="#hero"
          className="text-sm font-semibold tracking-tight hover:text-accent transition-colors"
        >
          {meta.name.split(' ')[0]}
          <span className="text-accent">.</span>
        </a>

        {/* Desktop navigation links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {/* "Why [School]?" link -- injected first when a school is active */}
          <AnimatePresence>
            {school && (
              <motion.li
                key="why-school-nav"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <a
                  href="#why-school"
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 whitespace-nowrap ${
                    activeSection === 'why-school'
                      ? 'text-accent'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {activeSection === 'why-school' && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent/5 dark:bg-accent/10 rounded-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Why {school.shortName}?</span>
                </a>
              </motion.li>
            )}
          </AnimatePresence>

          {navLinks.map(({ href, label }) => {
            const id = href.replace('#', '')
            const isActive = activeSection === id
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-accent'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {/* Animated highlight pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent/5 dark:bg-accent/10 rounded-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {school && (
                <li>
                  <a
                    href="#why-school"
                    onClick={closeMobile}
                    className="block py-2.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Why {school.shortName}?
                  </a>
                </li>
              )}
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={closeMobile}
                    className="block py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-accent transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

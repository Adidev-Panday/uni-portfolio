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
import { springUI } from '@/lib/motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { school, schoolId } = useSchoolTheme()

  // Show background/blur once page is scrolled past 24px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which section is currently in view.
  // Re-runs whenever the school changes, since the "why-school" section
  // mounts/unmounts from the DOM as it's selected/reset, and it needs to
  // be registered with the observer too.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
    if (sections.length === 0) return

    // How far from the top of the viewport a section's top edge has to
    // cross before it counts as "current" -- roughly the nav bar height
    // plus a little breathing room, so the section the user is actually
    // reading (not the one about to scroll into place) gets highlighted.
    const ACTIVATION_OFFSET = 120

    // Among all sections, the active one is the lowest one whose top has
    // already crossed the activation line (i.e. the section we've
    // scrolled into), not just "any section that's partially visible" --
    // that's what let a short section get skipped or the next section
    // light up early.
    const updateActive = () => {
      // Pinned to the very bottom of the page: force the last section
      // (Contact) active. A short final section can end well before it
      // ever crosses the activation line on its own, so without this the
      // nav gets stuck highlighting whatever came before it.
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2
      if (atBottom) {
        setActiveSection(sections[sections.length - 1].id)
        return
      }

      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          current = section.id
        }
      }
      setActiveSection(current)
    }

    const observer = new IntersectionObserver(updateActive, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '-100px 0px -60% 0px',
    })
    sections.forEach((s) => observer.observe(s))

    // The bottom-of-page check needs to run on every scroll tick near the
    // bottom, not just when an observed section's intersection ratio
    // crosses a threshold, so also wire it to plain scroll events.
    window.addEventListener('scroll', updateActive, { passive: true })

    // Run once immediately (e.g. a refresh landing mid-page) instead of
    // waiting for the first intersection change.
    updateActive()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateActive)
    }
  }, [schoolId])

  const closeMobile = () => setMobileOpen(false)

  // Double-click the logo to reset the whole admissions experience: clear
  // the stored choice/school, drop the active theme, and reload so the
  // first-visit popup shows again. A single click keeps the normal
  // href="#hero" scroll-to-top behavior.
  const resetExperience = () => {
    try { sessionStorage.clear() } catch { /* storage unavailable */ }
    document.documentElement.removeAttribute('data-school')
    window.location.href = '/'
  }

  return (
    <header
      data-scrolled={scrolled}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md shadow-[0_12px_24px_-18px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_24px_-18px_rgba(0,0,0,0.7)]'
          // Unscrolled, fully transparent in both modes so the hero photo
          // shows all the way to the top edge. Nav link text carries its
          // own subtle text-shadow (below) for legibility over the photo
          // instead of a backing scrim here.
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / logo */}
        <a
          href="#hero"
          onDoubleClick={(e) => { e.preventDefault(); resetExperience() }}
          title="Double-click to reset"
          className="text-sm font-semibold tracking-tight hover:text-accent transition-colors [text-shadow:0_1px_3px_rgba(255,255,255,0.8)] dark:[text-shadow:none]"
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
                transition={springUI}
                className="overflow-hidden"
              >
                <a
                  href="#why-school"
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 whitespace-nowrap [text-shadow:0_1px_3px_rgba(255,255,255,0.8)] dark:[text-shadow:none] ${
                    activeSection === 'why-school'
                      ? 'text-accent'
                      : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {activeSection === 'why-school' && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent/5 dark:bg-accent/10 rounded-md"
                      transition={springUI}
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
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 [text-shadow:0_1px_3px_rgba(255,255,255,0.8)] dark:[text-shadow:none] ${
                    isActive
                      ? 'text-accent'
                      : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {/* Animated highlight pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent/5 dark:bg-accent/10 rounded-md"
                      transition={springUI}
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
            transition={springUI}
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

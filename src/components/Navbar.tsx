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

  // Hero has no nav link of its own, but it IS one of the sections the
  // scrollspy below tracks, so this is just "is the hero still the
  // current section". Light mode only: while true, nav text goes white
  // to read against the photo; once the user scrolls past the hero it
  // drops back to the normal dark nav text. Dark mode never uses this.
  const overHero = activeSection === 'hero'

  // Shared class builder for the desktop nav links, so the "why school"
  // link and the mapped navLinks stay in sync instead of duplicating
  // the same four-way (active/inactive x overHero/not) logic twice.
  // overHero always reads white: the nav sits on the bare hero photo
  // there in both modes, not on --paper. The text-shadow is declared
  // at all times (just at zero alpha when not over the hero) so color
  // and text-shadow both interpolate smoothly across the swap instead
  // of snapping, since transition-property includes text-shadow below.
  const heroShadow = '[text-shadow:0_1px_4px_rgba(0,0,0,0.5)]'
  const flatShadow = '[text-shadow:0_1px_4px_rgba(0,0,0,0)]'
  const navLinkClass = (isActive: boolean) => {
    const shadow = overHero ? heroShadow : flatShadow
    if (isActive) {
      return `${overHero ? 'text-white' : 'text-accent'} ${shadow}`
    }
    return `${overHero ? 'text-white/80 hover:text-white' : 'text-muted hover:text-ink'} ${shadow}`
  }

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
          // Glassmorphism kept here only because it is functional: a nav
          // sitting over scrolled content needs some legibility backing.
          // One hairline rule, no glow shadow.
          ? 'bg-paper/85 backdrop-blur-md border-b border-rule'
          // Unscrolled, fully transparent in both modes so the hero photo
          // shows all the way to the top edge.
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / logo */}
        <a
          href="#hero"
          onDoubleClick={(e) => { e.preventDefault(); resetExperience() }}
          title="Double-click to reset"
          className={`font-serif text-base tracking-tight transition-[color,text-shadow] duration-300 hover:text-accent ${
            overHero ? `text-white ${heroShadow}` : `text-ink ${flatShadow}`
          }`}
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
                  className={`px-3 py-1.5 text-sm font-mono transition-[color,text-shadow] duration-300 whitespace-nowrap ${navLinkClass(activeSection === 'why-school')}`}
                >
                  Why {school.shortName}?
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
                  className={`px-3 py-1.5 text-sm font-mono transition-[color,text-shadow] duration-300 ${navLinkClass(isActive)}`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle overHero={overHero} />

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded transition-[color,filter] duration-300 ${
              overHero
                ? 'text-white hover:text-white/70 [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.5))]'
                : 'text-muted hover:text-ink [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0))]'
            }`}
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
            className="md:hidden overflow-hidden bg-paper border-b border-rule"
          >
            <ul className="px-6 py-4 flex flex-col gap-1 font-mono text-sm">
              {school && (
                <li>
                  <a
                    href="#why-school"
                    onClick={closeMobile}
                    className="block py-2.5 text-accent transition-colors"
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
                    className="block py-2.5 text-muted hover:text-ink transition-colors"
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

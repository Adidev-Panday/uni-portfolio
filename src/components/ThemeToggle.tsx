'use client'
// Dark / light mode toggle button.
// Reads the actual DOM state after mount to stay in sync with the
// inline theme script in layout.tsx, avoiding hydration mismatches.
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { springUI } from '@/lib/motion'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch (e) { /* storage unavailable */ }
  }

  // Render a placeholder before mount to avoid layout shift
  if (!mounted) {
    return <div className="w-8 h-8" aria-hidden />
  }

  return (
    <motion.button
      onClick={toggle}
      className="p-2 rounded text-muted hover:text-ink hover:bg-ink/5 transition-colors duration-300"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={springUI}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </motion.div>
    </motion.button>
  )
}

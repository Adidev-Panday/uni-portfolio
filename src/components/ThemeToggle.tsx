'use client'
// Dark / light mode toggle button.
// Reads the actual DOM state after mount to stay in sync with the
// inline theme script in layout.tsx, avoiding hydration mismatches.
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { springUI } from '@/lib/motion'

interface ThemeToggleProps {
  // Light mode only: true while the nav sits over the still-visible
  // hero photo, so the icon goes white to stay legible there.
  overHero?: boolean
}

export default function ThemeToggle({ overHero = false }: ThemeToggleProps) {
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
      className={`p-2 rounded-lg transition-[color,text-shadow] duration-200 ${
        overHero
          ? 'text-white hover:text-white/80 hover:bg-white/10 dark:text-zinc-500 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.4))] dark:[filter:none]'
          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
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

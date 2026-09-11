import type { Config } from 'tailwindcss'

const config: Config = {
  // Enable class-based dark mode (toggled by adding/removing the 'dark' class on <html>)
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // --font-inter is set by next/font in layout.tsx
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // All accent colors are driven by CSS custom properties in globals.css.
        // Setting --accent-rgb / --accent-fill on :root rethemes the entire site.
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-secondary': 'rgb(var(--accent-secondary-rgb) / <alpha-value>)',
        // accent-fill has no opacity modifier support — used only for solid fills
        'accent-fill': 'var(--accent-fill)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

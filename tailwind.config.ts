import type { Config } from 'tailwindcss'

const config: Config = {
  // Enable class-based dark mode (toggled by adding/removing the 'dark' class on <html>)
  darkMode: 'class',
  future: {
    // Scope every hover: / group-hover: variant to devices that actually
    // support hover (@media (hover: hover) and (pointer: fine)), so a tap
    // on touch can't leave a link stuck in its hover state (§6).
    hoverOnlyWhenSupported: true,
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // The Links section builds its card gradients from a `gradient` string in
  // content.json (e.g. "from-emerald-700 to-emerald-900"). Tailwind's JIT
  // scanner only reads .ts/.tsx/.js/.jsx/.mdx files for class names, so a
  // color combo that only exists in the JSON data never gets generated and
  // the card renders with no background at all (invisible white-on-white
  // text in light mode). Safelist every from-/to-700/900 pair so any color
  // used in that JSON field always has real CSS behind it.
  safelist: [
    {
      pattern: /^(from|to)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|zinc|slate|gray|neutral|stone)-(700|900)$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        // --font-plex-sans / --font-fraunces / --font-jetbrains-mono are
        // set by next/font in layout.tsx.
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // All accent colors are driven by CSS custom properties in globals.css.
        // Setting --accent-rgb / --accent-fill on :root rethemes the entire site.
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-secondary': 'rgb(var(--accent-secondary-rgb) / <alpha-value>)',
        // accent-fill has no opacity modifier support: used only for solid fills
        'accent-fill': 'var(--accent-fill)',
        // Editorial base tokens (src/styles/tokens.css), opacity-modifier
        // capable via the *-rgb triplets, same pattern as accent above.
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        rule: 'rgb(var(--rule-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
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

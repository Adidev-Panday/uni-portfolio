import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { MotionConfig } from 'motion/react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { meta } from '@/data/content'

// Display serif for the hero name and section titles: a variable face
// with real character, not a generic SaaS sans.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-fraunces',
  display: 'swap',
})

// Body copy: a humanist sans, not Inter/Poppins/Roboto.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})

// Technical labels, section numbers, metadata, dates.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// Serif display face reserved for the Princeton / Harvard / Berkeley
// bespoke theme headings. The font file is only fetched by the browser
// when one of those data-school values actually applies it, so other
// themes pay no cost.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

// Runs before first paint to set the dark/light class on <html>,
// preventing a flash of the wrong theme on load.
const themeInitScript = `
  try {
    var t = localStorage.getItem('theme') ?? 'dark';
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch(e) {}
`

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
  metadataBase: new URL(meta.siteUrl),
  openGraph: {
    title: `${meta.name} Portfolio`,
    description: meta.description,
    url: meta.siteUrl,
    siteName: meta.name,
    images: [{ url: meta.ogImage, width: 1200, height: 630, alt: `${meta.name} Portfolio` }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${meta.name} Portfolio`,
    description: meta.description,
    images: [meta.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛰️</text></svg>',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the 'dark' class is applied client-side before
    // hydration, so React will see a mismatch; suppress that one warning.
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${plexSans.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <head>
        {/* Inline theme script runs synchronously before any CSS/JS */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        {/* reducedMotion="user": every Motion animation site-wide drops to
            an opacity-only cross-fade when the OS has reduced motion on
            (§14), with zero per-component changes needed. */}
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { meta } from '@/data/content'

// Load Inter via next/font — zero layout shift, self-hosted by Vercel
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Serif display face reserved for the Princeton bespoke theme's headings.
// The font file is only fetched by the browser when data-school="princeton"
// actually applies it, so other themes pay no cost.
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
    title: `${meta.name} — Portfolio`,
    description: meta.description,
    url: meta.siteUrl,
    siteName: meta.name,
    images: [{ url: meta.ogImage, width: 1200, height: 630, alt: `${meta.name} Portfolio` }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${meta.name} — Portfolio`,
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
    // hydration, so React will see a mismatch — suppress that one warning.
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Inline theme script runs synchronously before any CSS/JS */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

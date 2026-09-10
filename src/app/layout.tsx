import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { meta } from '@/data/content'

// Load Inter via next/font — zero layout shift, self-hosted by Vercel
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  title: {
    default: `${meta.name} — Portfolio`,
    template: `%s | ${meta.name}`,
  },
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
  // Update with your real icon files in /public
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the 'dark' class is applied client-side before
    // hydration, so React will see a mismatch — suppress that one warning.
    <html lang="en" suppressHydrationWarning className={inter.variable}>
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

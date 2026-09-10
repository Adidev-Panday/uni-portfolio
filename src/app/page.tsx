// Root page — assembles all sections in order.
// To reorder or hide a section, edit this file.
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Research from '@/components/Research'
import Projects from '@/components/Projects'
import Extracurriculars from '@/components/Extracurriculars'
import HonorsAwards from '@/components/HonorsAwards'
import Links from '@/components/Links'
import Contact from '@/components/Contact'
import { meta } from '@/data/content'

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Research />
        <Projects />
        <Extracurriculars />
        <HonorsAwards />
        <Links />
        <Contact />
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-xs text-zinc-400">
        <p>
          {meta.name} · Built with Next.js &amp; Tailwind CSS ·{' '}
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  )
}

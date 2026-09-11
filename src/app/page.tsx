// Root page: assembles all sections in order.
// To reorder or hide a section, edit this file.
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Research from '@/components/Research'
import Projects from '@/components/Projects'
import Extracurriculars from '@/components/Extracurriculars'
import HonorsAwards from '@/components/HonorsAwards'
import Links from '@/components/Links'
import CV from '@/components/CV'
import Contact from '@/components/Contact'
import AdmissionsModal from '@/components/AdmissionsModal'
import { meta } from '@/data/content'

export default function Home() {
  return (
    <>
      <AdmissionsModal />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Research />
        <Projects />
        <Extracurriculars />
        <HonorsAwards />
        <Links />
        <CV />
        <Contact />
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-xs text-zinc-400 space-y-1">
        <p>
          {meta.name} · {new Date().getFullYear()}
        </p>
        <p>Disclaimer: Built Using Claude Code [Next.js &amp; Tailwind CSS]</p>
      </footer>
    </>
  )
}

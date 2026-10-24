// Root page: assembles all sections in order.
// To reorder or hide a section, edit this file.
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Research from '@/components/Research'
import Projects from '@/components/Projects'
import Links from '@/components/Links'
import CV from '@/components/CV'
import Contact from '@/components/Contact'
import AdmissionsModal from '@/components/AdmissionsModal'
import WhySchool from '@/components/WhySchool'
import WhyAerospace from '@/components/WhyAerospace'
import PrincetonCheerOverlay from '@/components/PrincetonEasterEggs'
import HarvardRevealOverlay from '@/components/HarvardEasterEggs'
import BerkeleyOskiOverlay from '@/components/BerkeleyEasterEggs'
import SchoolMotifOverlay from '@/components/SchoolMotif'
import { meta } from '@/data/content'

export default function Home() {
  return (
    <>
      <AdmissionsModal />
      <PrincetonCheerOverlay />
      <HarvardRevealOverlay />
      <BerkeleyOskiOverlay />
      <SchoolMotifOverlay />
      <Navbar />

      <main>
        <Hero />
        <WhySchool />
        <About />
        <WhyAerospace />
        <Projects />
        <Research />
        <Links />
        <CV />
        <Contact />
      </main>

      <footer className="border-t border-rule py-8 text-center text-xs font-mono text-muted space-y-1">
        <p>
          {meta.name} · {new Date().getFullYear()}
        </p>
        <p>Disclaimer: Built Using Claude Code [Next.js &amp; Tailwind CSS]</p>
      </footer>
    </>
  )
}

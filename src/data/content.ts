// Single source of truth is src/data/content.json.
// This file re-exports typed values from that JSON so all existing
// component imports (e.g. `import { hero } from '@/data/content'`) keep working.

import data from './content.json'

// ---- Types ----------------------------------------------------------------

export type ResearchPaper = {
  title: string
  journal: string
  year: string
  link: string
  linkLabel: string
  pageNote?: string
  abstract: string
  status: 'published' | 'preprint' | 'in review' | 'unpublished'
  statusLabel: string
  modalTitle: string
  modalBlurb: string
  modalButtonLabel: string
}

export type Project = {
  name: string
  description: string
  role: string
  tags: string[]
  demo?: string
  github?: string
  storyLink?: { label: string; href: string }
  statusBadge?: string
  statusNote?: string
  modalTitle: string
  modalBlurb: string
  modalLink?: { label: string; href: string }
}

export type ProfileLink = {
  label: string
  handle: string
  href: string
  gradient: string
}

// ---- Exports --------------------------------------------------------------

export const meta        = data.meta
export const navLinks    = data.navLinks
export const hero        = data.hero
export const about       = data.about
export const research    = data.research as ResearchPaper[]
export const projects    = data.projects as Project[]
export const profileLinks = data.profileLinks as ProfileLink[]
export const cv           = data.cv
export const contact     = data.contact
export type WhySchoolEntry = {
  opener: string
  bullets: [string, string, string]
  pullQuote?: string
}

export const whySchool   = data.whySchool as unknown as {
  defaultTemplate: WhySchoolEntry
  schools: Record<string, WhySchoolEntry>
}

export type WhyAerospacePhoto = { src: string; alt: string }

export const whyAerospace = data.whyAerospace as {
  heading: string
  subtitle: string
  paragraphs: string[]
  photos: WhyAerospacePhoto[]
}

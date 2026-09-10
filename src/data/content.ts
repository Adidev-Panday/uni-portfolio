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
  status: 'published' | 'preprint' | 'in review'
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
}

export type Extracurricular = {
  role: string
  organization: string
  grades: string
  description: string
}

export type Honor = {
  award: string
  issuer: string
  level: string
  description: string
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
export const extracurriculars = data.extracurriculars as Extracurricular[]
export const honors      = data.honors as Honor[]
export const profileLinks = data.profileLinks as ProfileLink[]
export const contact     = data.contact

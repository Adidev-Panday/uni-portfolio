// ============================================================
// PORTFOLIO CONTENT FILE
// ============================================================
// This is the SINGLE SOURCE OF TRUTH for all portfolio content.
// Edit only this file to update any text, links, or data across
// the entire site. Each export maps 1-to-1 to a page section.
// ============================================================

// ------------------------------------------------------------
// META — Site-wide info, SEO, Open Graph
// ------------------------------------------------------------
export const meta = {
  name: 'Adidev Panday',
  tagline: 'Building things that matter.',
  // Description shown in Google snippets and OG previews
  description:
    'Student, researcher, and builder. Passionate about AI, software engineering, and creating meaningful impact.',
  // Replace with your real email
  email: 'adidev@example.com',
  // Replace with your deployed Vercel URL
  siteUrl: 'https://adidev-portfolio.vercel.app',
  // Place og-image.png in the /public folder (1200×630px recommended)
  ogImage: '/og-image.png',
}

// ------------------------------------------------------------
// NAV LINKS — Displayed in the sticky navbar
// ------------------------------------------------------------
export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#research', label: 'Research' },
  { href: '#projects', label: 'Projects' },
  { href: '#extracurriculars', label: 'Extracurriculars' },
  { href: '#honors', label: 'Honors' },
  { href: '#links', label: 'Links' },
  { href: '#contact', label: 'Contact' },
]

// ------------------------------------------------------------
// HERO — First section, above the fold
// ------------------------------------------------------------
export const hero = {
  greeting: 'Hi, I\'m',
  name: 'Adidev Panday',
  tagline: 'Building at the intersection of AI and real-world impact.',
  // 2-3 sentence intro — keep it punchy
  intro:
    'I\'m a student, researcher, and builder passionate about artificial intelligence, software engineering, and creating tools that make a difference. Currently studying at [University Name] and working on [Current Focus Area].',
  ctas: [
    { label: 'View Projects', href: '#projects', primary: true },
    { label: 'Read Research', href: '#research', primary: false },
  ],
}

// ------------------------------------------------------------
// ABOUT — Life overview paragraph(s)
// ------------------------------------------------------------
export const about = {
  // Add or remove paragraphs freely — each string becomes its own <p> tag
  paragraphs: [
    'PLACEHOLDER: Write a compelling life-overview paragraph here. Describe your background, what drives you, and your journey so far. This might cover where you grew up, what first sparked your interest in technology and research, and how those experiences shaped your path.',
    'PLACEHOLDER: Continue with your academic journey, key experiences, or formative moments. What are you studying? What do you care deeply about? What are you working toward over the next few years?',
  ],
}

// ------------------------------------------------------------
// RESEARCH — Published papers and pre-prints
// ------------------------------------------------------------
export type ResearchPaper = {
  title: string
  journal: string
  year: string
  link: string // Full URL to the paper
  abstract: string
  status: 'published' | 'preprint' | 'in review'
}

export const research: ResearchPaper[] = [
  {
    title:
      'PLACEHOLDER: Your Research Paper Title Goes Here — A Study of Something Fascinating',
    journal: 'Journal of Placeholder Studies',
    year: '2024',
    link: '#', // Replace with DOI or paper URL
    abstract:
      'PLACEHOLDER: Replace this with your paper\'s abstract. Summarize the research question, methodology, and key findings in 2–4 sentences. What problem did you address? What approach did you take? What did you discover or contribute?',
    status: 'published',
  },
  // To add more papers, copy the object above and paste it here.
]

// ------------------------------------------------------------
// PROJECTS — Card grid
// ------------------------------------------------------------
export type Project = {
  name: string
  description: string
  tags: string[] // Tech/language tags displayed as badges
  github?: string // GitHub repo URL (optional)
  demo?: string // Live demo URL (optional)
}

export const projects: Project[] = [
  {
    name: 'WoodLink',
    description:
      'PLACEHOLDER: A brief, compelling description of WoodLink. What does it do, what problem does it solve, and what was your role? Aim for 1–2 punchy sentences.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    github: 'https://github.com/Adidev-Panday/WoodLink',
    demo: '#',
  },
  {
    name: 'NYTPuzzleSolver',
    description:
      'PLACEHOLDER: Describe NYTPuzzleSolver. Which NYT puzzle does it crack (Connections, Wordle, Spelling Bee…)? What algorithms or techniques are under the hood?',
    tags: ['Python', 'NLP', 'Algorithms'],
    github: 'https://github.com/Adidev-Panday/NYTPuzzleSolver',
  },
  {
    name: 'GrowwBot',
    description:
      'PLACEHOLDER: Describe GrowwBot — what it does, what platform it targets, and the core functionality or intelligence behind it.',
    tags: ['Python', 'Machine Learning', 'Finance', 'API'],
    github: 'https://github.com/Adidev-Panday/GrowwBot',
  },
  {
    name: 'Balancify',
    description:
      'PLACEHOLDER: Describe Balancify — what problem does it solve for users? What\'s the core value proposition and key features?',
    tags: ['React Native', 'TypeScript', 'Firebase'],
    github: 'https://github.com/Adidev-Panday/Balancify',
    demo: '#',
  },
  {
    name: 'DriveSafe',
    description:
      'PLACEHOLDER: Describe DriveSafe — what safety problem does it address? What computer vision or ML techniques power it?',
    tags: ['Python', 'Computer Vision', 'OpenCV', 'ML'],
    github: 'https://github.com/Adidev-Panday/DriveSafe',
  },
  // Add more projects here
]

// ------------------------------------------------------------
// EXTRACURRICULARS — Expandable accordion list
// ------------------------------------------------------------
export type Extracurricular = {
  role: string
  organization: string
  startDate: string // e.g. "Sep 2023"
  endDate: string // e.g. "Present"
  description: string
}

export const extracurriculars: Extracurricular[] = [
  {
    role: 'PLACEHOLDER Role / Position Title',
    organization: 'PLACEHOLDER Organization Name',
    startDate: 'Sep 2023',
    endDate: 'Present',
    description:
      'PLACEHOLDER: Describe your responsibilities, key achievements, and impact. What did you build, lead, or contribute? 1–3 sentences.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Club / Society',
    startDate: 'Jan 2023',
    endDate: 'Aug 2023',
    description:
      'PLACEHOLDER: Describe what you contributed to this organization and what you learned or built.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Sep 2022',
    endDate: 'Dec 2022',
    description:
      'PLACEHOLDER: Brief description of this extracurricular and your contributions.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Jun 2022',
    endDate: 'Aug 2022',
    description: 'PLACEHOLDER: Brief description of this role.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Jan 2022',
    endDate: 'May 2022',
    description: 'PLACEHOLDER: Brief description.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Sep 2021',
    endDate: 'Dec 2021',
    description: 'PLACEHOLDER: Brief description.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Jun 2021',
    endDate: 'Aug 2021',
    description: 'PLACEHOLDER: Brief description.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Sep 2020',
    endDate: 'May 2021',
    description: 'PLACEHOLDER: Brief description.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Jun 2020',
    endDate: 'Aug 2020',
    description: 'PLACEHOLDER: Brief description.',
  },
  {
    role: 'PLACEHOLDER Role',
    organization: 'PLACEHOLDER Organization',
    startDate: 'Sep 2019',
    endDate: 'May 2020',
    description: 'PLACEHOLDER: Brief description.',
  },
  // Add more entries here — the accordion handles any number
]

// ------------------------------------------------------------
// HONORS & AWARDS
// ------------------------------------------------------------
export type Honor = {
  award: string
  issuer: string
  date: string // e.g. "2024" or "May 2024"
  description: string
}

export const honors: Honor[] = [
  {
    award: 'PLACEHOLDER Award Name',
    issuer: 'PLACEHOLDER Issuing Organization',
    date: '2024',
    description:
      'PLACEHOLDER: Brief description of the award, what it recognizes, and why you received it.',
  },
  {
    award: 'PLACEHOLDER Scholarship / Fellowship Name',
    issuer: 'PLACEHOLDER Institution',
    date: '2023',
    description:
      'PLACEHOLDER: Description of this scholarship, the selection criteria, and its significance.',
  },
  {
    award: 'PLACEHOLDER Honor / Recognition',
    issuer: 'PLACEHOLDER Organization',
    date: '2023',
    description: 'PLACEHOLDER: Description of this honor.',
  },
  {
    award: 'PLACEHOLDER Award',
    issuer: 'PLACEHOLDER Issuer',
    date: '2022',
    description: 'PLACEHOLDER: Description.',
  },
  {
    award: 'PLACEHOLDER Award',
    issuer: 'PLACEHOLDER Issuer',
    date: '2022',
    description: 'PLACEHOLDER: Description.',
  },
  // Add more honors here
]

// ------------------------------------------------------------
// PROFILE LINKS — Prominent link cards (GitHub, LinkedIn, etc.)
// ------------------------------------------------------------
export type ProfileLink = {
  label: string
  handle: string
  href: string
  // Tailwind gradient classes for the card background
  gradient: string
}

export const profileLinks: ProfileLink[] = [
  {
    label: 'GitHub',
    handle: '@Adidev-Panday',
    href: 'https://github.com/Adidev-Panday',
    gradient: 'from-zinc-700 to-zinc-900',
  },
  {
    label: 'LinkedIn',
    handle: 'Adidev Panday',
    href: 'https://linkedin.com/in/adidev-panday', // Replace with real URL
    gradient: 'from-blue-700 to-blue-900',
  },
  {
    label: 'Medium',
    handle: '@adidev-panday',
    href: 'https://medium.com/@adidev-panday', // Replace with real URL
    gradient: 'from-emerald-700 to-emerald-900',
  },
  {
    label: 'ENAI',
    handle: 'Emerging AI Network',
    href: '#', // Replace with real ENAI membership URL
    gradient: 'from-violet-700 to-violet-900',
  },
]

// ------------------------------------------------------------
// CONTACT
// ------------------------------------------------------------
export const contact = {
  email: 'adidev@example.com', // Replace with your real email
  tagline:
    'Have an idea, an opportunity, or just want to say hi? My inbox is open.',
  social: [
    { label: 'GitHub', href: 'https://github.com/Adidev-Panday' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/adidev-panday' },
    { label: 'Medium', href: 'https://medium.com/@adidev-panday' },
  ],
}

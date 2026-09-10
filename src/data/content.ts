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
  tagline: 'Aspiring aerospace engineer. AI builder. Researcher.',
  description:
    'Adidev Panday — aspiring aerospace engineer, AI builder, and researcher. IB student at Woodstock School, India. Building at the intersection of physics, design, and code.',
  email: 'panday.adidev@gmail.com',
  // Update this once you have a custom domain or final Vercel URL
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
  greeting: "Hi, I'm",
  name: 'Adidev Panday',
  tagline: 'Aspiring aerospace engineer. AI builder. Researcher.',
  intro:
    "I'm a Woodstock School student from Ludhiana, India, headed for aerospace engineering: the place where physics, design, and code meet. I build AI-driven apps, publish research, and spend my spare hours on F1 aerodynamics, the violin, and football. This is everything I've made and earned, in one place.",
  ctas: [
    { label: 'View Projects', href: '#projects', primary: true },
    { label: 'Read Research', href: '#research', primary: false },
  ],
}

// ------------------------------------------------------------
// ABOUT — Life overview paragraph(s)
// ------------------------------------------------------------
export const about = {
  // Each string renders as its own <p> tag. Add or remove freely.
  paragraphs: [
    'I grew up in Ludhiana, Punjab, and study at Woodstock School, taking HL Physics, Math AA, and Computer Science in the IB Diploma. My focus is aerospace engineering, where rigorous physics meets real design.',
    'Outside class, I build things. I\'ve shipped AI-powered web apps, developed a React Native app to tackle teen drunk-driving in my hometown, and published research on the risks of digital trading. I co-founded my school\'s AI Club, lead the yearbook as Editor in Chief, and play first chair violin in the Advanced Orchestra. I\'ve competed in varsity football and basketball, interned in product development and CAD, and served on the Academic Honesty Council.',
    'I\'m drawn to problems that reward both rigor and creativity — from modeling 4th-down football decisions with game theory to studying how a paper plane\'s wing generates lift.',
  ],
}

// ------------------------------------------------------------
// RESEARCH — Published papers and pre-prints
// ------------------------------------------------------------
export type ResearchPaper = {
  title: string
  journal: string
  year: string
  link: string      // Full URL to the paper / issue PDF
  linkLabel: string // Text shown on the link button
  pageNote?: string // Optional note about page number within the issue
  abstract: string
  status: 'published' | 'preprint' | 'in review'
}

export const research: ResearchPaper[] = [
  {
    title:
      'The Rise of Digital Trading: Accessibility Versus Risk of Financial Ruin',
    journal:
      'International Journal of High School Research (IJHSR), Vol. 8, Issue 12',
    year: '2026',
    link: 'https://terra-docs.s3.us-east-2.amazonaws.com/IJHSR/Articles/volume8-issue12/IJHSR_2026_812.pdf',
    linkLabel: 'Read paper (p. 89)',
    pageNote: 'Paper begins on page 89 of the issue.',
    abstract:
      'A data-driven analysis across financial trading platforms examining the tension between user accessibility and the risk of financial ruin for everyday investors, and what that trade-off means for retail participation in modern markets.',
    status: 'published',
  },
  // Add more papers here — copy the object above and fill in your details.
]

// ------------------------------------------------------------
// PROJECTS — Card grid
// ------------------------------------------------------------
export type Project = {
  name: string
  description: string
  role: string        // Your role on the project
  tags: string[]      // Tech tags shown as badges
  demo?: string       // Live demo URL
  github?: string     // GitHub repo URL (optional)
  // For projects with a story/blog post instead of a live demo
  storyLink?: { label: string; href: string }
  // Optional status badge, e.g. "Private / in progress"
  statusBadge?: string
}

export const projects: Project[] = [
  {
    name: 'GrowwBot',
    description:
      'An AI-powered personal finance advisor that gives users tailored, conversational guidance on budgeting, investing, and financial planning.',
    role: 'Developer',
    tags: ['Web App', 'AI / LLM'],
    demo: 'https://growwbot.netlify.app/',
  },
  {
    name: 'Balancify',
    description:
      'An AI timetable and schedule maker that builds balanced, personalized study and activity plans — designed for students juggling academics and extracurriculars.',
    role: 'Developer',
    tags: ['Web App', 'AI / LLM'],
    demo: 'https://wsbalancify.netlify.app/#schedule-maker',
  },
  {
    name: 'NYT Puzzle Solver',
    description:
      'A tool that solves and surfaces daily answers for New York Times puzzles, built for the daily players who need a nudge (or a full solution).',
    role: 'Developer',
    tags: ['Web App'],
    demo: 'https://nytpuzzleanswers.netlify.app/',
  },
  {
    name: 'DriveSafe',
    description:
      'A mobile app built to reduce teen drunk-driving in my hometown, featuring role-based flows, OTP authentication, real-time ride dispatch, and UPI payments. Currently being scaled for publishing.',
    role: 'Founder & Developer',
    tags: ['React Native', 'Firebase'],
    storyLink: {
      label: 'Read the story',
      href: 'https://adidev.medium.com/drivesafe-an-attempt-to-reduce-teen-drunk-driving-c1f10162a53f',
    },
  },
  {
    name: 'WoodLink',
    description:
      'An alumni networking platform for Woodstock School, reconnecting graduates with current students through a full-stack web app. Currently runs locally.',
    role: 'Founder & Developer',
    tags: ['Full-Stack', 'Web App'],
    github: 'https://github.com/Adidev-Panday/WoodLink',
    statusBadge: 'Private / in progress',
  },
]

// ------------------------------------------------------------
// EXTRACURRICULARS — Expandable accordion list
// ------------------------------------------------------------
export type Extracurricular = {
  role: string
  organization: string
  grades: string // e.g. "Grades 9–12"
  description: string
}

export const extracurriculars: Extracurricular[] = [
  {
    role: '1st Chair Violinist',
    organization: 'Advanced Orchestra, Woodstock School',
    grades: 'Grades 9–12',
    description:
      'Rose from 3rd chair junior to 1st chair advanced over 5 years, performing ABRSM Level 5–7 repertoire across 7 school concerts.',
  },
  {
    role: 'Co-Founder & Leader',
    organization: 'AI Club, Woodstock School',
    grades: 'Grades 10–12',
    description:
      'Co-founded and lead a club of 10+ students exploring Claude Code, Codex, Gemini, Lovable, and prompt engineering in weekly hands-on sessions.',
  },
  {
    role: 'Editor in Chief',
    organization: 'School Yearbook, Woodstock School',
    grades: 'Grades 10–12',
    description:
      'Lead full yearbook production: designed 50+ pages, oversaw layout and editing, and shot content for school social media.',
  },
  {
    role: 'Goalkeeper & Defender',
    organization: 'Varsity Football, Woodstock School',
    grades: 'Grades 9–11',
    description:
      'Competed in 7+ tournaments and 25+ matches over 5 years, contributing to 18+ team wins across regional competitions.',
  },
  {
    role: 'Shooting Guard',
    organization: 'Varsity Basketball, Woodstock School',
    grades: 'Grades 9–11',
    description:
      'Competed in 4+ tournaments and 20+ matches, contributing to 11+ wins and a 1st-place finish at the THS Regional Tournament.',
  },
  {
    role: 'Engineering Intern',
    organization: 'KGOC and BAUM, India',
    grades: 'Grade 11',
    description:
      'Completed two engineering internships: product development at KGOC (concept to finished product) and CAD fundamentals plus industrial product design at BAUM.',
  },
  {
    role: 'Senior Intern',
    organization: 'Woodstock School',
    grades: 'Grades 10–12',
    description:
      'Held two senior roles: Estates Head Intern managing campus logistics, and Alumni Senior Intern strengthening alumni relations.',
  },
  {
    role: 'Certified Hiker',
    organization: 'Outdoor Education — Woodstock School & Negi Wilderness Camp',
    grades: 'Grades 9–12',
    description:
      'Certified in Leave No Trace hiking, Wilderness First Aid, adult and child CPR, and Epi-Pen administration through multi-day expeditions.',
  },
  {
    role: 'Organizer',
    organization: 'Service Learning Day 2024, Woodstock School',
    grades: 'Grade 10',
    description:
      'Coordinated 210 students in 20 groups for inclusive activities and mural painting with underprivileged children.',
  },
  {
    role: 'Researcher & Author',
    organization: 'STEM Research, Woodstock School',
    grades: 'Grades 11–12',
    description:
      'Wrote a 4,000-word Extended Essay modeling 4th-down decisions via Nash Equilibrium, plus a Physics IA on paper-plane wing aerodynamics.',
  },
  {
    role: 'Academic Integrity & Service Leader',
    organization: 'Academic Honesty Council (AHC) & NHS, Woodstock School',
    grades: 'Grades 10–12',
    description:
      'Led 30+ academic integrity hearings, delivered an INIA webinar to 80+ students, and organized 20+ NHS service events.',
  },
]

// ------------------------------------------------------------
// HONORS & AWARDS
// ------------------------------------------------------------
export type Honor = {
  award: string
  issuer: string
  level: string // e.g. "International", "School", "School, Regional, National"
  description: string
}

export const honors: Honor[] = [
  {
    award: 'Highest Overall IBDP Score, DP1',
    issuer: 'Woodstock School',
    level: 'School',
    description:
      'Ranked 1st in a cohort of 85 students for highest overall IB Diploma score in DP1.',
  },
  {
    award: 'Published Research Author',
    issuer: 'International Journal of High School Research (IJHSR)',
    level: 'International',
    description:
      'Published "The Rise of Digital Trading: Accessibility Versus Risk of Financial Ruin" in the IJHSR.',
  },
  {
    award: 'Student Ambassador',
    issuer: 'European Network for Academic Integrity (ENAI)',
    level: 'International',
    description:
      'Selected as 1 of only 2 high schoolers in a PhD-level cohort of academic integrity ambassadors.',
  },
  {
    award: 'Academic Honesty Council Member',
    issuer: 'Woodstock School',
    level: 'School · Regional · National',
    description:
      'Selected to uphold and adjudicate academic integrity across the school, with reach at regional and national level.',
  },
  {
    award: 'National Honor Society Member',
    issuer: 'NHS',
    level: 'School',
    description:
      'Inducted for excellence in scholarship, service, leadership, and character.',
  },
  {
    award: 'School-Wide Language Ambassador — Spanish',
    issuer: 'Woodstock School',
    level: 'School · Regional',
    description:
      'Selected as 1 of 250 students to represent the Spanish language across the school community.',
  },
  {
    award: 'Honor Roll',
    issuer: 'Woodstock School',
    level: 'School',
    description:
      '1 of 15 students recognized on the academic honor roll.',
  },
  {
    award: '2nd Place, E-Assessment',
    issuer: 'Woodstock School',
    level: 'School',
    description: 'Placed 2nd in school-wide E-Assessment.',
  },
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
    href: 'https://www.linkedin.com/in/adidevpanday/',
    gradient: 'from-blue-700 to-blue-900',
  },
  {
    label: 'Medium',
    handle: 'adidev.medium.com',
    href: 'https://adidev.medium.com/',
    gradient: 'from-emerald-700 to-emerald-900',
  },
  {
    label: 'ENAI',
    handle: 'Student Ambassador',
    href: 'https://www.academicintegrity.eu/wp/student-ambassadors/',
    gradient: 'from-violet-700 to-violet-900',
  },
]

// ------------------------------------------------------------
// CONTACT
// ------------------------------------------------------------
export const contact = {
  email: 'panday.adidev@gmail.com',
  tagline:
    'Have an idea, an opportunity, or just want to say hi? My inbox is open.',
  social: [
    { label: 'GitHub', href: 'https://github.com/Adidev-Panday' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adidevpanday/' },
    { label: 'Medium', href: 'https://adidev.medium.com/' },
  ],
}

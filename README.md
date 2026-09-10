# Adidev Panday — Portfolio

A modern, minimal single-page portfolio website built with Next.js 15, Tailwind CSS, and Framer Motion (motion).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 (class-based dark mode)
- **Animations**: [motion](https://motion.dev) (Framer Motion)
- **Icons**: lucide-react
- **Deployment**: Vercel (zero config)

## Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Name, tagline, intro, CTAs |
| 2 | About | Bio paragraph(s) + photo placeholder |
| 3 | Research | Published papers with abstract & link |
| 4 | Projects | Card grid — WoodLink, NYTPuzzleSolver, GrowwBot, Balancify, DriveSafe |
| 5 | Extracurriculars | Animated accordion (10+ entries) |
| 6 | Honors & Awards | Card grid of recognitions |
| 7 | Links | GitHub, LinkedIn, Medium, ENAI |
| 8 | Contact | Email CTA + social links |

## Editing Content

**All content lives in one file:** `src/data/content.ts`

Open that file and replace every `PLACEHOLDER` string with real content. Each export is clearly commented:

```
meta          → site-wide info, SEO, Open Graph
navLinks      → navbar items
hero          → first-section text + CTAs
about         → bio paragraphs
research      → array of papers
projects      → array of project cards
extracurriculars → accordion entries
honors        → awards & recognition
profileLinks  → link cards (GitHub, LinkedIn, etc.)
contact       → email + social links
```

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/Adidev-Panday/uni-portfolio.git
cd uni-portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:3000)
npm run dev
```

## Build & Preview

```bash
npm run build    # production build
npm run start    # serve the production build locally
npm run lint     # ESLint check
```

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub Integration (recommended)

1. Push this repo to GitHub (already done).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the `uni-portfolio` repository.
4. Click **Deploy** — no configuration needed.

Vercel auto-detects Next.js and handles everything.

### After Deploying

Update `siteUrl` in `src/data/content.ts` with your real Vercel URL, then redeploy.

## Customisation Tips

| Goal | What to edit |
|------|--------------|
| Change accent color | `tailwind.config.ts` → extend `colors.accent`, then find-replace `indigo` in components |
| Add a profile photo | Replace the initials `<div>` in `src/components/About.tsx` with `<Image src="/photo.jpg" ... />` |
| Add more projects | Append to the `projects` array in `src/data/content.ts` |
| Reorder sections | Edit the import order in `src/app/page.tsx` |
| Add OG image | Drop a 1200×630px `og-image.png` into `/public` |
| Add a favicon | Drop `favicon.ico` into `/public` |

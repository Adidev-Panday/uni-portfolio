'use client'
// /admin -- password-protected content editor.
// Fetches live content.json from GitHub via /api/content (server route).
// Saves via /api/save (server route). No secrets are ever in this file.
//
// Field coverage here is audited against what each component in
// src/components actually reads from content.json, so every input here
// changes something real on the live site. Two arrays are intentionally
// NOT addable/removable even though others are: WhyAerospace's `photos`
// (the bento grid layout indexes photos[0..4] by position) and its
// `paragraphs` (also indexed by position, not mapped generically).

import { useState, useCallback } from 'react'
import { LogOut, ChevronDown, ChevronUp, Check, AlertCircle, Loader2 } from 'lucide-react'
import { SCHOOLS } from '@/data/schools'

// --------------------------------------------------------------------------
// Types (mirrors content.json shape)
// --------------------------------------------------------------------------

type Cta       = { label: string; href: string; primary: boolean }
type Social    = { label: string; href: string }
type ModalLink = { label: string; href: string }
type NavLink   = { href: string; label: string }
type Photo     = { src: string; alt: string }

type ResearchPaper = {
  title: string; journal: string; year: string; link: string
  linkLabel: string; pageNote: string; abstract: string
  status: string; statusLabel: string
  modalTitle: string; modalBlurb: string; modalButtonLabel: string
}

type ProjectEntry = {
  name: string; description: string; role: string; tags: string[]
  demo: string; github: string
  storyLink?: { label: string; href: string }
  statusBadge: string; statusNote: string
  modalTitle: string; modalBlurb: string; modalLink?: ModalLink
}

type ContentJson = {
  meta: {
    name: string; tagline: string; description: string
    email: string; siteUrl: string; ogImage: string
  }
  navLinks: NavLink[]
  hero: {
    greeting: string; name: string; tagline: string; intro: string; ctas: Cta[]
  }
  about: { heading: string; subtitle: string; paragraphs: string[] }
  research: ResearchPaper[]
  projects: ProjectEntry[]
  profileLinks: { label: string; handle: string; href: string; gradient: string }[]
  cv: { body: string; buttonLabel: string; pdfHref: string }
  contact: { email: string; tagline: string; social: Social[] }
  whyAerospace: {
    heading: string; subtitle: string; paragraphs: string[]; photos: Photo[]
  }
  whySchool: { defaultTemplate: string; schools: Record<string, string> }
}

// --------------------------------------------------------------------------
// Small UI primitives
// --------------------------------------------------------------------------

function Label({ text }: { text: string }) {
  return (
    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
      {text}
    </label>
  )
}

function Field({ lbl, hint, children }: { lbl: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label text={lbl} />
      {hint && <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-1.5 leading-snug">{hint}</p>}
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
    />
  )
}

function Textarea({ value, onChange, rows = 3, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors resize-y"
    />
  )
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-xs text-red-500 hover:text-red-400 font-medium">
      Remove
    </button>
  )
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="text-xs text-accent hover:opacity-80 font-medium">
      {children}
    </button>
  )
}

// Top-level collapsible section card
function SectionCard({ numberLabel, title, subtitle, open, onToggle, children }: {
  numberLabel?: string; title: string; subtitle?: string
  open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
        aria-expanded={open}
      >
        <div>
          {numberLabel && (
            <span className="text-accent font-mono text-xs tracking-widest uppercase">{numberLabel}</span>
          )}
          <h2 className="text-base font-bold mt-0.5">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 sm:px-6 pb-6 pt-1 space-y-4 border-t border-zinc-100 dark:border-zinc-800/60">
          {children}
        </div>
      )}
    </div>
  )
}

// Nested collapsible row, used for each project / research paper
function SubCard({ title, open, onToggle, onRemove, children }: {
  title: string; open: boolean; onToggle: () => void; onRemove: () => void; children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40 overflow-hidden">
      <div className="w-full flex items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 flex-1 text-left min-w-0"
          aria-expanded={open}
        >
          <ChevronDown
            size={14}
            className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
          <span className="text-sm font-semibold truncate">{title}</span>
        </button>
        <RemoveButton onClick={onRemove} />
      </div>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-zinc-200/70 dark:border-zinc-800/70">
          {children}
        </div>
      )}
    </div>
  )
}

function StatusPill({ status, errMsg }: { status: 'idle' | 'saving' | 'saved' | 'error'; errMsg: string }) {
  if (status === 'saving') {
    return (
      <p className="flex items-center gap-1.5 text-sm text-zinc-400">
        <Loader2 size={14} className="animate-spin" /> Saving...
      </p>
    )
  }
  if (status === 'saved') {
    return (
      <p className="flex items-center gap-1.5 text-sm text-emerald-500">
        <Check size={14} /> Saved. Site will rebuild and go live in about a minute.
      </p>
    )
  }
  if (status === 'error') {
    return (
      <p className="flex items-center gap-1.5 text-sm text-red-500">
        <AlertCircle size={14} /> Error: {errMsg}
      </p>
    )
  }
  return null
}

// --------------------------------------------------------------------------
// Why [University] essay editor
// --------------------------------------------------------------------------

function WhySchoolEditor({ c, update }: {
  c: ContentJson
  update: <K extends keyof ContentJson>(section: K, fn: (draft: ContentJson[K]) => void) => void
}) {
  const [selected, setSelected] = useState<string>(SCHOOLS[0].id)
  const school = SCHOOLS.find(s => s.id === selected) ?? SCHOOLS[0]
  const custom = c.whySchool.schools[selected]
  const hasCustom = !!custom && custom.trim().length > 0
  const renderedDefault = c.whySchool.defaultTemplate.replace(/\{school\}/g, school.name)

  const setText = (v: string) => {
    update('whySchool', d => {
      if (v.trim() === '') {
        delete d.schools[selected]
      } else {
        d.schools[selected] = v
      }
    })
  }

  return (
    <div className="space-y-5">
      <Field
        lbl="Default template"
        hint={'Used for any school without its own custom essay below. Use {school} as a placeholder for the school\'s full name.'}
      >
        <Textarea
          rows={3}
          value={c.whySchool.defaultTemplate}
          onChange={v => update('whySchool', d => { d.defaultTemplate = v })}
        />
      </Field>

      <div className="grid md:grid-cols-[200px_1fr] gap-4">
        {/* School list */}
        <div className="max-h-[420px] overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
          {SCHOOLS.map(s => {
            const isCustom = !!c.whySchool.schools[s.id]?.trim()
            const isSelected = s.id === selected
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span className="truncate">{s.shortName}</span>
                <span
                  className={`shrink-0 w-1.5 h-1.5 rounded-full ${isCustom ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                  title={isCustom ? 'Custom copy' : 'Using default template'}
                />
              </button>
            )
          })}
        </div>

        {/* Editor */}
        <div className="space-y-2 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-sm">{school.name}</h3>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                hasCustom
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {hasCustom ? 'Custom copy' : 'Using default template'}
            </span>
          </div>
          {!hasCustom && (
            <AddButton onClick={() => setText(renderedDefault)}>
              Start from the default template
            </AddButton>
          )}
          <Textarea
            rows={12}
            value={custom ?? ''}
            onChange={setText}
            placeholder={renderedDefault}
          />
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">
            Shown on the site when an admissions officer picks {school.name}. Clear this box to fall back to the default template above.
          </p>
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// Main page
// --------------------------------------------------------------------------

const STATUS_OPTIONS = ['published', 'preprint', 'in review', 'unpublished']

export default function AdminPage() {
  const [password, setPassword]   = useState('')
  const [authed, setAuthed]       = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [content, setContent] = useState<ContentJson | null>(null)
  const [sha, setSha]         = useState('')
  const [status, setStatus]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errMsg, setErrMsg]   = useState('')

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const toggle = useCallback((key: string) => {
    setOpenSections(s => ({ ...s, [key]: !s[key] }))
  }, [])
  const isOpen = (key: string) => !!openSections[key]

  const SECTION_KEYS = ['meta', 'hero', 'about', 'whyAerospace', 'projects', 'research', 'links', 'cv', 'contact', 'whySchool']
  const expandAll   = () => setOpenSections(Object.fromEntries(SECTION_KEYS.map(k => [k, true])))
  const collapseAll = () => setOpenSections({})

  // -- Auth: verify password by hitting the server route --------------------
  const login = useCallback(async () => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/content', {
        headers: { 'x-admin-password': password },
      })
      if (res.status === 401) { setAuthError('Wrong password.'); return }
      if (!res.ok) { setAuthError('Server error. Try again.'); return }
      const data = await res.json() as { content: ContentJson; sha: string }
      setContent(data.content)
      setSha(data.sha)
      setAuthed(true)
    } catch {
      setAuthError('Network error. Try again.')
    } finally {
      setAuthLoading(false)
    }
  }, [password])

  // -- Save -----------------------------------------------------------------
  const save = useCallback(async () => {
    if (!content) return
    setStatus('saving')
    setErrMsg('')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content, sha }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        setErrMsg(d.error ?? 'Unknown error')
        setStatus('error')
        return
      }
      setStatus('saved')
    } catch {
      setErrMsg('Network error.')
      setStatus('error')
    }
  }, [content, password, sha])

  // -- Exit: end the admin session and return to the normal site -----------
  const exit = useCallback(() => {
    setAuthed(false)
    setContent(null)
    setPassword('')
    setSha('')
    setStatus('idle')
    window.location.href = '/'
  }, [])

  // -- Typed update helper ----------------------------------------------------
  const update = useCallback(<K extends keyof ContentJson>(
    section: K,
    fn: (draft: ContentJson[K]) => void,
  ) => {
    setContent(prev => {
      if (!prev) return prev
      const next = structuredClone(prev)
      fn(next[section])
      return next
    })
    setStatus('idle')
  }, [])

  // -- Password gate --------------------------------------------------------
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin</h1>
          <p className="text-sm text-zinc-500 text-center">Enter your admin password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {authError && <p className="text-sm text-red-500">{authError}</p>}
          <button
            onClick={login}
            disabled={authLoading || !password}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
          >
            {authLoading ? 'Checking...' : 'Login'}
          </button>
        </div>
      </div>
    )
  }

  if (!content) return null

  const c = content

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <div className="flex-1 px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-5 pb-6">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-bold">Portfolio Admin</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Edits here go live on the site after a save.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={expandAll}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-accent font-medium"
              >
                <ChevronDown size={13} /> Expand all
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-accent font-medium"
              >
                <ChevronUp size={13} /> Collapse all
              </button>
              <button
                onClick={exit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 font-semibold text-sm transition-colors"
                aria-label="Exit admin session"
              >
                <LogOut size={15} />
                Exit
              </button>
            </div>
          </div>

          {/* META */}
          <SectionCard title="Meta / SEO" subtitle="Page title, description, social preview" open={isOpen('meta')} onToggle={() => toggle('meta')}>
            <Field lbl="Site name"><Input value={c.meta.name} onChange={v => update('meta', d => { d.name = v })} /></Field>
            <Field lbl="Tagline" hint="Used in the browser tab / social preview title."><Input value={c.meta.tagline} onChange={v => update('meta', d => { d.tagline = v })} /></Field>
            <Field lbl="Description" hint="Shown in search engine results and social share cards."><Textarea value={c.meta.description} onChange={v => update('meta', d => { d.description = v })} /></Field>
            <Field lbl="Email"><Input value={c.meta.email} onChange={v => update('meta', d => { d.email = v })} /></Field>
            <Field lbl="Site URL"><Input value={c.meta.siteUrl} onChange={v => update('meta', d => { d.siteUrl = v })} /></Field>
          </SectionCard>

          {/* HERO */}
          <SectionCard title="Hero" subtitle="The first thing visitors see" open={isOpen('hero')} onToggle={() => toggle('hero')}>
            <Field lbl="Hero tag" hint="Small line above your name, e.g. 'Hey, I'm'"><Input value={c.hero.greeting} onChange={v => update('hero', d => { d.greeting = v })} /></Field>
            <Field lbl="Hero name"><Input value={c.hero.name} onChange={v => update('hero', d => { d.name = v })} /></Field>
            <Field lbl="Hero subtitle" hint="Line directly under your name, e.g. 'Aspiring Aerospace Engineer'"><Input value={c.hero.tagline} onChange={v => update('hero', d => { d.tagline = v })} /></Field>
            <Field lbl="Hero body paragraph"><Textarea rows={5} value={c.hero.intro} onChange={v => update('hero', d => { d.intro = v })} /></Field>
            <div className="space-y-2">
              <Label text="Hero buttons" />
              {c.hero.ctas.map((cta, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <Input value={cta.label} onChange={v => update('hero', d => { d.ctas[i].label = v })} placeholder="Button label" />
                  <Input value={cta.href} onChange={v => update('hero', d => { d.ctas[i].href = v })} placeholder="Link / section id, e.g. #projects" />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ABOUT */}
          <SectionCard numberLabel="01." title="About" open={isOpen('about')} onToggle={() => toggle('about')}>
            <Field lbl="Heading"><Input value={c.about.heading} onChange={v => update('about', d => { d.heading = v })} /></Field>
            <Field lbl="Subtitle" hint="Optional, shown under the heading. Leave blank to hide."><Input value={c.about.subtitle} onChange={v => update('about', d => { d.subtitle = v })} /></Field>
            {c.about.paragraphs.map((para, i) => (
              <div key={i} className="space-y-1">
                <Label text={`Body paragraph ${i + 1}`} />
                <Textarea rows={6} value={para} onChange={v => update('about', d => { d.paragraphs[i] = v })} />
                <div className="flex justify-end">
                  <RemoveButton onClick={() => update('about', d => { d.paragraphs.splice(i, 1) })} />
                </div>
              </div>
            ))}
            <AddButton onClick={() => update('about', d => { d.paragraphs.push('') })}>+ Add paragraph</AddButton>
          </SectionCard>

          {/* WHY AEROSPACE */}
          <SectionCard numberLabel="02." title="Why Aerospace" open={isOpen('whyAerospace')} onToggle={() => toggle('whyAerospace')}>
            <Field lbl="Heading"><Input value={c.whyAerospace.heading} onChange={v => update('whyAerospace', d => { d.heading = v })} /></Field>
            <Field lbl="Subtitle"><Input value={c.whyAerospace.subtitle} onChange={v => update('whyAerospace', d => { d.subtitle = v })} /></Field>

            {/* Fixed at exactly 2: the bento layout places these by position, not a loop */}
            <Field lbl="Body paragraph 1" hint="Shown beside the hero photo pair, top row of the layout.">
              <Textarea rows={6} value={c.whyAerospace.paragraphs[0] ?? ''} onChange={v => update('whyAerospace', d => { d.paragraphs[0] = v })} />
            </Field>
            <Field lbl="Body paragraph 2" hint="Shown beside the toy-bike and robotics photos.">
              <Textarea rows={6} value={c.whyAerospace.paragraphs[1] ?? ''} onChange={v => update('whyAerospace', d => { d.paragraphs[1] = v })} />
            </Field>

            <div className="space-y-2">
              <Label text="Photo alt text" />
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug mb-1">
                Captions are hidden on the site; alt text is only read by screen readers and search engines. Photos themselves are fixed to these 5 files and positions.
              </p>
              {c.whyAerospace.photos.map((photo, i) => (
                <div key={i} className="grid grid-cols-[1fr_2fr] gap-3 items-center">
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{photo.src}</code>
                  <Input value={photo.alt} onChange={v => update('whyAerospace', d => { d.photos[i].alt = v })} placeholder="Alt text" />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* PROJECTS */}
          <SectionCard numberLabel="03." title="Projects" open={isOpen('projects')} onToggle={() => toggle('projects')}>
            <div className="space-y-3">
              {c.projects.map((project, i) => (
                <SubCard
                  key={i}
                  title={project.name || `Project ${i + 1}`}
                  open={isOpen(`project-${i}`)}
                  onToggle={() => toggle(`project-${i}`)}
                  onRemove={() => update('projects', d => { d.splice(i, 1) })}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field lbl="Name"><Input value={project.name} onChange={v => update('projects', d => { d[i].name = v })} /></Field>
                    <Field lbl="Role" hint="Small mono label under the name"><Input value={project.role} onChange={v => update('projects', d => { d[i].role = v })} /></Field>
                  </div>
                  <Field lbl="Description"><Textarea rows={3} value={project.description} onChange={v => update('projects', d => { d[i].description = v })} /></Field>
                  <Field lbl="Tech tags" hint="Comma-separated. Shown as small pill tags on the card.">
                    <Input
                      value={project.tags.join(', ')}
                      onChange={v => update('projects', d => { d[i].tags = v.split(',').map(t => t.trim()).filter(Boolean) })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field lbl="Live link URL"><Input value={project.demo ?? ''} onChange={v => update('projects', d => { d[i].demo = v })} /></Field>
                    <Field lbl="GitHub URL"><Input value={project.github ?? ''} onChange={v => update('projects', d => { d[i].github = v })} /></Field>
                  </div>
                  <Field lbl="Modal title" hint="Heading of the popup shown when the card is clicked">
                    <Input value={project.modalTitle} onChange={v => update('projects', d => { d[i].modalTitle = v })} />
                  </Field>
                  <Field lbl="Modal body" hint="Body text of that popup">
                    <Textarea rows={3} value={project.modalBlurb} onChange={v => update('projects', d => { d[i].modalBlurb = v })} />
                  </Field>
                  <Field lbl="Modal button" hint="Button shown in the popup. Leave both blank to show a single 'Got it' button instead (use this when there is no live link).">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={project.modalLink?.label ?? ''}
                        onChange={v => update('projects', d => {
                          const next = { label: v, href: d[i].modalLink?.href ?? '' }
                          d[i].modalLink = (next.label.trim() || next.href.trim()) ? next : undefined
                        })}
                        placeholder="Button label, e.g. Open site"
                      />
                      <Input
                        value={project.modalLink?.href ?? ''}
                        onChange={v => update('projects', d => {
                          const next = { label: d[i].modalLink?.label ?? '', href: v }
                          d[i].modalLink = (next.label.trim() || next.href.trim()) ? next : undefined
                        })}
                        placeholder="Button URL"
                      />
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field lbl="Status badge" hint="e.g. 'Private / in progress'. Leave blank to hide.">
                      <Input value={project.statusBadge ?? ''} onChange={v => update('projects', d => { d[i].statusBadge = v })} />
                    </Field>
                    <Field lbl="Status note" hint="Small disclaimer line under the tags. Leave blank to hide.">
                      <Input value={project.statusNote ?? ''} onChange={v => update('projects', d => { d[i].statusNote = v })} />
                    </Field>
                  </div>
                </SubCard>
              ))}
            </div>
            <AddButton onClick={() => update('projects', d => {
              d.push({
                name: '', description: '', role: '', tags: [], demo: '', github: '',
                statusBadge: '', statusNote: '', modalTitle: '', modalBlurb: '',
              })
            })}>
              + Add project
            </AddButton>
          </SectionCard>

          {/* RESEARCH */}
          <SectionCard numberLabel="04." title="Research" open={isOpen('research')} onToggle={() => toggle('research')}>
            <div className="space-y-3">
              {c.research.map((paper, i) => (
                <SubCard
                  key={i}
                  title={paper.title || `Paper ${i + 1}`}
                  open={isOpen(`research-${i}`)}
                  onToggle={() => toggle(`research-${i}`)}
                  onRemove={() => update('research', d => { d.splice(i, 1) })}
                >
                  <Field lbl="Title"><Textarea rows={2} value={paper.title} onChange={v => update('research', d => { d[i].title = v })} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field lbl="Publication / source"><Input value={paper.journal} onChange={v => update('research', d => { d[i].journal = v })} /></Field>
                    <Field lbl="Year"><Input value={paper.year} onChange={v => update('research', d => { d[i].year = v })} /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field lbl="Status color" hint="Controls the badge color only">
                      <Select value={paper.status} onChange={v => update('research', d => { d[i].status = v })} options={STATUS_OPTIONS} />
                    </Field>
                    <Field lbl="Badge label" hint="The visible badge text, e.g. 'Published / Independent'">
                      <Input value={paper.statusLabel} onChange={v => update('research', d => { d[i].statusLabel = v })} />
                    </Field>
                  </div>
                  <Field lbl="Link URL"><Input value={paper.link} onChange={v => update('research', d => { d[i].link = v })} /></Field>
                  <Field lbl="Page note" hint="Optional small mono note, e.g. 'Paper begins on page 89'">
                    <Input value={paper.pageNote ?? ''} onChange={v => update('research', d => { d[i].pageNote = v })} />
                  </Field>
                  <Field lbl="Body / abstract"><Textarea rows={4} value={paper.abstract} onChange={v => update('research', d => { d[i].abstract = v })} /></Field>
                  <Field lbl="Modal title" hint="Heading of the popup shown when the card is clicked">
                    <Input value={paper.modalTitle} onChange={v => update('research', d => { d[i].modalTitle = v })} />
                  </Field>
                  <Field lbl="Modal body"><Textarea rows={3} value={paper.modalBlurb} onChange={v => update('research', d => { d[i].modalBlurb = v })} /></Field>
                  <Field lbl="Modal button label"><Input value={paper.modalButtonLabel} onChange={v => update('research', d => { d[i].modalButtonLabel = v })} /></Field>
                </SubCard>
              ))}
            </div>
            <AddButton onClick={() => update('research', d => {
              d.push({
                title: '', journal: '', year: '', link: '', linkLabel: '', pageNote: '', abstract: '',
                status: 'published', statusLabel: '', modalTitle: '', modalBlurb: '', modalButtonLabel: 'Open paper',
              })
            })}>
              + Add paper
            </AddButton>
          </SectionCard>

          {/* LINKS */}
          <SectionCard numberLabel="05." title="Links" subtitle="Find Me Online cards" open={isOpen('links')} onToggle={() => toggle('links')}>
            {c.profileLinks.map((link, i) => (
              <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{link.label || `Link ${i + 1}`}</span>
                  <RemoveButton onClick={() => update('profileLinks', d => { d.splice(i, 1) })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field lbl="Platform label" hint="Small uppercase label at the top of the card"><Input value={link.label} onChange={v => update('profileLinks', d => { d[i].label = v })} /></Field>
                  <Field lbl="Handle" hint="Large bold text on the card"><Input value={link.handle} onChange={v => update('profileLinks', d => { d[i].handle = v })} /></Field>
                </div>
                <Field lbl="URL"><Input value={link.href} onChange={v => update('profileLinks', d => { d[i].href = v })} /></Field>
                <Field lbl="Gradient classes" hint="Tailwind gradient, e.g. 'from-blue-700 to-blue-900'">
                  <Input value={link.gradient} onChange={v => update('profileLinks', d => { d[i].gradient = v })} />
                </Field>
              </div>
            ))}
            <AddButton onClick={() => update('profileLinks', d => {
              d.push({ label: '', handle: '', href: '', gradient: 'from-zinc-700 to-zinc-900' })
            })}>
              + Add link
            </AddButton>
          </SectionCard>

          {/* CV */}
          <SectionCard numberLabel="06." title="CV" open={isOpen('cv')} onToggle={() => toggle('cv')}>
            <Field lbl="Body line"><Textarea value={c.cv.body} onChange={v => update('cv', d => { d.body = v })} /></Field>
            <Field lbl="Button label"><Input value={c.cv.buttonLabel} onChange={v => update('cv', d => { d.buttonLabel = v })} /></Field>
            <Field lbl="PDF link" hint="Path to the file in /public, defaults to /cv.pdf">
              <Input value={c.cv.pdfHref} onChange={v => update('cv', d => { d.pdfHref = v })} />
            </Field>
          </SectionCard>

          {/* CONTACT */}
          <SectionCard numberLabel="07." title="Contact" open={isOpen('contact')} onToggle={() => toggle('contact')}>
            <Field lbl="Email"><Input value={c.contact.email} onChange={v => update('contact', d => { d.email = v })} /></Field>
            <Field lbl="Tagline"><Textarea value={c.contact.tagline} onChange={v => update('contact', d => { d.tagline = v })} /></Field>
            <div className="space-y-2">
              <Label text="Social links" />
              {c.contact.social.map((s, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <Input value={s.label} onChange={v => update('contact', d => { d.social[i].label = v })} placeholder="Label, e.g. Instagram" />
                  <Input value={s.href} onChange={v => update('contact', d => { d.social[i].href = v })} placeholder="URL" />
                </div>
              ))}
              <div className="flex gap-4">
                <AddButton onClick={() => update('contact', d => { d.social.push({ label: '', href: '' }) })}>+ Add link</AddButton>
                {c.contact.social.length > 0 && (
                  <RemoveButton onClick={() => update('contact', d => { d.social.pop() })} />
                )}
              </div>
            </div>
          </SectionCard>

          {/* WHY [UNIVERSITY] ESSAYS */}
          <SectionCard
            numberLabel="00."
            title="Why [University] Essays"
            subtitle="Shown only when an admissions officer picks a school"
            open={isOpen('whySchool')}
            onToggle={() => toggle('whySchool')}
          >
            <WhySchoolEditor c={c} update={update} />
          </SectionCard>

        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 inset-x-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-end gap-4">
          <StatusPill status={status} errMsg={errMsg} />
          <button
            onClick={save}
            disabled={status === 'saving'}
            className="px-6 py-3 rounded-xl bg-accent-fill hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm transition-opacity"
          >
            {status === 'saving' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

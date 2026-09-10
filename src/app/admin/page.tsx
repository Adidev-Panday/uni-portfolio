'use client'
// /admin -- password-protected content editor.
// Fetches live content.json from GitHub via /api/content (server route).
// Saves via /api/save (server route). No secrets are ever in this file.

import { useState, useCallback } from 'react'

// --------------------------------------------------------------------------
// Types (mirrors content.json shape)
// --------------------------------------------------------------------------

type Cta          = { label: string; href: string; primary: boolean }
type Social       = { label: string; href: string }
type StoryLink    = { label: string; href: string }
type NavLink      = { href: string; label: string }

type ContentJson = {
  meta: {
    name: string; tagline: string; description: string
    email: string; siteUrl: string; ogImage: string
  }
  navLinks: NavLink[]
  hero: {
    greeting: string; name: string; tagline: string; intro: string; ctas: Cta[]
  }
  about: { paragraphs: string[] }
  research: {
    title: string; journal: string; year: string; link: string
    linkLabel: string; pageNote: string; abstract: string; status: string
  }[]
  projects: {
    name: string; description: string; role: string; tags: string[]
    demo: string; github: string; storyLink: StoryLink; statusBadge: string; statusNote: string
  }[]
  extracurriculars: { role: string; organization: string; grades: string; description: string }[]
  honors: { award: string; issuer: string; level: string; description: string }[]
  profileLinks: { label: string; handle: string; href: string; gradient: string }[]
  contact: { email: string; tagline: string; social: Social[] }
}

// --------------------------------------------------------------------------
// Small UI helpers
// --------------------------------------------------------------------------

const label = (text: string) => (
  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
    {text}
  </label>
)

function Input({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  )
}

function Textarea({ value, onChange, rows = 3 }: {
  value: string; onChange: (v: string) => void; rows?: number
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
    />
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <h2 className="text-base font-bold text-indigo-500">{title}</h2>
      {children}
    </div>
  )
}

function Field({ lbl, children }: { lbl: string; children: React.ReactNode }) {
  return (
    <div>
      {label(lbl)}
      {children}
    </div>
  )
}

// --------------------------------------------------------------------------
// Main page
// --------------------------------------------------------------------------

export default function AdminPage() {
  const [password, setPassword]   = useState('')
  const [authed, setAuthed]       = useState(false)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [content, setContent] = useState<ContentJson | null>(null)
  const [sha, setSha]         = useState('')
  const [status, setStatus]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errMsg, setErrMsg]   = useState('')

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

  // -- Typed update helpers -------------------------------------------------
  type DeepSet<T> = (fn: (draft: T) => void) => void

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header + Save */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          <div className="flex items-center gap-3">
            {status === 'saved' && (
              <p className="text-sm text-emerald-500">
                Saved! Site will rebuild and go live in about a minute.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-500">Error: {errMsg}</p>
            )}
            {status === 'saving' && (
              <p className="text-sm text-zinc-400">Saving...</p>
            )}
            <button
              onClick={save}
              disabled={status === 'saving'}
              className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {status === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* META */}
        <Card title="Meta / SEO">
          <Field lbl="Site name"><Input value={c.meta.name} onChange={v => update('meta', d => { d.name = v })} /></Field>
          <Field lbl="Tagline"><Input value={c.meta.tagline} onChange={v => update('meta', d => { d.tagline = v })} /></Field>
          <Field lbl="Description"><Textarea value={c.meta.description} onChange={v => update('meta', d => { d.description = v })} /></Field>
          <Field lbl="Email"><Input value={c.meta.email} onChange={v => update('meta', d => { d.email = v })} /></Field>
          <Field lbl="Site URL"><Input value={c.meta.siteUrl} onChange={v => update('meta', d => { d.siteUrl = v })} /></Field>
        </Card>

        {/* HERO */}
        <Card title="Hero">
          <Field lbl="Greeting"><Input value={c.hero.greeting} onChange={v => update('hero', d => { d.greeting = v })} /></Field>
          <Field lbl="Name"><Input value={c.hero.name} onChange={v => update('hero', d => { d.name = v })} /></Field>
          <Field lbl="Tagline"><Input value={c.hero.tagline} onChange={v => update('hero', d => { d.tagline = v })} /></Field>
          <Field lbl="Intro"><Textarea value={c.hero.intro} rows={4} onChange={v => update('hero', d => { d.intro = v })} /></Field>
          <div>
            {label('CTAs')}
            {c.hero.ctas.map((cta, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 mb-2">
                <Input value={cta.label} onChange={v => update('hero', d => { d.ctas[i].label = v })} placeholder="Label" />
                <Input value={cta.href} onChange={v => update('hero', d => { d.ctas[i].href = v })} placeholder="href" />
              </div>
            ))}
          </div>
        </Card>

        {/* ABOUT */}
        <Card title="About">
          {c.about.paragraphs.map((para, i) => (
            <div key={i} className="space-y-1">
              {label(`Paragraph ${i + 1}`)}
              <Textarea rows={4} value={para} onChange={v => update('about', d => { d.paragraphs[i] = v })} />
              <div className="flex justify-end">
                <button
                  onClick={() => update('about', d => { d.paragraphs.splice(i, 1) })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => update('about', d => { d.paragraphs.push('') })}
            className="text-xs text-indigo-500 hover:text-indigo-400"
          >
            + Add paragraph
          </button>
        </Card>

        {/* RESEARCH */}
        <Card title="Research Papers">
          {c.research.map((paper, i) => (
            <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Paper {i + 1}</span>
                <button
                  onClick={() => update('research', d => { d.splice(i, 1) })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <Field lbl="Title"><Textarea rows={2} value={paper.title} onChange={v => update('research', d => { d[i].title = v })} /></Field>
              <Field lbl="Journal"><Input value={paper.journal} onChange={v => update('research', d => { d[i].journal = v })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Year"><Input value={paper.year} onChange={v => update('research', d => { d[i].year = v })} /></Field>
                <Field lbl="Status"><Input value={paper.status} onChange={v => update('research', d => { d[i].status = v })} placeholder="published / preprint / in review" /></Field>
              </div>
              <Field lbl="Link URL"><Input value={paper.link} onChange={v => update('research', d => { d[i].link = v })} /></Field>
              <Field lbl="Link label"><Input value={paper.linkLabel} onChange={v => update('research', d => { d[i].linkLabel = v })} /></Field>
              <Field lbl="Page note"><Input value={paper.pageNote ?? ''} onChange={v => update('research', d => { d[i].pageNote = v })} /></Field>
              <Field lbl="Abstract"><Textarea rows={4} value={paper.abstract} onChange={v => update('research', d => { d[i].abstract = v })} /></Field>
            </div>
          ))}
          <button
            onClick={() => update('research', d => {
              d.push({ title: '', journal: '', year: '', link: '', linkLabel: '', pageNote: '', abstract: '', status: 'published' })
            })}
            className="text-xs text-indigo-500 hover:text-indigo-400"
          >
            + Add paper
          </button>
        </Card>

        {/* PROJECTS */}
        <Card title="Projects">
          {c.projects.map((project, i) => (
            <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{project.name || `Project ${i + 1}`}</span>
                <button
                  onClick={() => update('projects', d => { d.splice(i, 1) })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Name"><Input value={project.name} onChange={v => update('projects', d => { d[i].name = v })} /></Field>
                <Field lbl="Role"><Input value={project.role} onChange={v => update('projects', d => { d[i].role = v })} /></Field>
              </div>
              <Field lbl="Description"><Textarea rows={3} value={project.description} onChange={v => update('projects', d => { d[i].description = v })} /></Field>
              <Field lbl="Tags (comma-separated)">
                <Input
                  value={project.tags.join(', ')}
                  onChange={v => update('projects', d => { d[i].tags = v.split(',').map(t => t.trim()).filter(Boolean) })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Demo URL"><Input value={project.demo ?? ''} onChange={v => update('projects', d => { d[i].demo = v })} /></Field>
                <Field lbl="GitHub URL"><Input value={project.github ?? ''} onChange={v => update('projects', d => { d[i].github = v })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Story link label"><Input value={project.storyLink?.label ?? ''} onChange={v => update('projects', d => { d[i].storyLink = { ...d[i].storyLink, label: v } })} /></Field>
                <Field lbl="Story link URL"><Input value={project.storyLink?.href ?? ''} onChange={v => update('projects', d => { d[i].storyLink = { ...d[i].storyLink, href: v } })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Status badge"><Input value={project.statusBadge ?? ''} onChange={v => update('projects', d => { d[i].statusBadge = v })} /></Field>
                <Field lbl="Status note"><Input value={project.statusNote ?? ''} onChange={v => update('projects', d => { d[i].statusNote = v })} /></Field>
              </div>
            </div>
          ))}
          <button
            onClick={() => update('projects', d => {
              d.push({ name: '', description: '', role: '', tags: [], demo: '', github: '', storyLink: { label: '', href: '' }, statusBadge: '', statusNote: '' })
            })}
            className="text-xs text-indigo-500 hover:text-indigo-400"
          >
            + Add project
          </button>
        </Card>

        {/* EXTRACURRICULARS */}
        <Card title="Extracurriculars">
          {c.extracurriculars.map((item, i) => (
            <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.role || `Item ${i + 1}`}</span>
                <button
                  onClick={() => update('extracurriculars', d => { d.splice(i, 1) })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Role"><Input value={item.role} onChange={v => update('extracurriculars', d => { d[i].role = v })} /></Field>
                <Field lbl="Grades"><Input value={item.grades} onChange={v => update('extracurriculars', d => { d[i].grades = v })} /></Field>
              </div>
              <Field lbl="Organization"><Input value={item.organization} onChange={v => update('extracurriculars', d => { d[i].organization = v })} /></Field>
              <Field lbl="Description"><Textarea rows={3} value={item.description} onChange={v => update('extracurriculars', d => { d[i].description = v })} /></Field>
            </div>
          ))}
          <button
            onClick={() => update('extracurriculars', d => {
              d.push({ role: '', organization: '', grades: '', description: '' })
            })}
            className="text-xs text-indigo-500 hover:text-indigo-400"
          >
            + Add extracurricular
          </button>
        </Card>

        {/* HONORS */}
        <Card title="Honors & Awards">
          {c.honors.map((honor, i) => (
            <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{honor.award || `Honor ${i + 1}`}</span>
                <button
                  onClick={() => update('honors', d => { d.splice(i, 1) })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Award"><Input value={honor.award} onChange={v => update('honors', d => { d[i].award = v })} /></Field>
                <Field lbl="Level"><Input value={honor.level} onChange={v => update('honors', d => { d[i].level = v })} /></Field>
              </div>
              <Field lbl="Issuer"><Input value={honor.issuer} onChange={v => update('honors', d => { d[i].issuer = v })} /></Field>
              <Field lbl="Description"><Textarea rows={4} value={honor.description} onChange={v => update('honors', d => { d[i].description = v })} /></Field>
            </div>
          ))}
          <button
            onClick={() => update('honors', d => {
              d.push({ award: '', issuer: '', level: '', description: '' })
            })}
            className="text-xs text-indigo-500 hover:text-indigo-400"
          >
            + Add honor
          </button>
        </Card>

        {/* PROFILE LINKS */}
        <Card title="Links / Profiles">
          {c.profileLinks.map((link, i) => (
            <div key={i} className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{link.label || `Link ${i + 1}`}</span>
                <button
                  onClick={() => update('profileLinks', d => { d.splice(i, 1) })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field lbl="Label"><Input value={link.label} onChange={v => update('profileLinks', d => { d[i].label = v })} /></Field>
                <Field lbl="Handle"><Input value={link.handle} onChange={v => update('profileLinks', d => { d[i].handle = v })} /></Field>
              </div>
              <Field lbl="URL"><Input value={link.href} onChange={v => update('profileLinks', d => { d[i].href = v })} /></Field>
              <Field lbl="Gradient classes"><Input value={link.gradient} onChange={v => update('profileLinks', d => { d[i].gradient = v })} placeholder="e.g. from-blue-700 to-blue-900" /></Field>
            </div>
          ))}
          <button
            onClick={() => update('profileLinks', d => {
              d.push({ label: '', handle: '', href: '', gradient: 'from-zinc-700 to-zinc-900' })
            })}
            className="text-xs text-indigo-500 hover:text-indigo-400"
          >
            + Add link
          </button>
        </Card>

        {/* CONTACT */}
        <Card title="Contact">
          <Field lbl="Email"><Input value={c.contact.email} onChange={v => update('contact', d => { d.email = v })} /></Field>
          <Field lbl="Tagline"><Textarea value={c.contact.tagline} onChange={v => update('contact', d => { d.tagline = v })} /></Field>
          <div>
            {label('Social links')}
            {c.contact.social.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 mb-2">
                <Input value={s.label} onChange={v => update('contact', d => { d.social[i].label = v })} placeholder="Label" />
                <Input value={s.href} onChange={v => update('contact', d => { d.social[i].href = v })} placeholder="URL" />
              </div>
            ))}
            <div className="flex gap-4">
              <button
                onClick={() => update('contact', d => { d.social.push({ label: '', href: '' }) })}
                className="text-xs text-indigo-500 hover:text-indigo-400"
              >
                + Add link
              </button>
              {c.contact.social.length > 0 && (
                <button
                  onClick={() => update('contact', d => { d.social.pop() })}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  Remove last
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Bottom Save */}
        <div className="flex items-center justify-end gap-4 pb-8">
          {status === 'saved' && (
            <p className="text-sm text-emerald-500">
              Saved! Site will rebuild and go live in about a minute.
            </p>
          )}
          {status === 'error' && <p className="text-sm text-red-500">Error: {errMsg}</p>}
          {status === 'saving' && <p className="text-sm text-zinc-400">Saving...</p>}
          <button
            onClick={save}
            disabled={status === 'saving'}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
          >
            {status === 'saving' ? 'Saving...' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  )
}

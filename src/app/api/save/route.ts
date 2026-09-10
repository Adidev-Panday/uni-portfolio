// POST /api/save
// Verifies the admin password, then commits updated content.json to GitHub.
// Triggers a Vercel redeploy automatically via GitHub push.
// Runs server-side only. GITHUB_TOKEN and ADMIN_PASSWORD never reach the client.

import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN   = process.env.GITHUB_TOKEN   ?? ''
const GITHUB_OWNER   = process.env.GITHUB_OWNER   ?? ''
const GITHUB_REPO    = process.env.GITHUB_REPO    ?? ''
const GITHUB_BRANCH  = process.env.GITHUB_BRANCH  ?? 'main'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function POST(req: NextRequest) {
  // 1. Auth
  const body = await req.json() as { password: string; content: unknown; sha: string }
  if (!ADMIN_PASSWORD || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Validate content shape
  if (!body.content || typeof body.content !== 'object') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 })
  }

  // 3. Encode new content as base64
  const newJson = JSON.stringify(body.content, null, 2) + '\n'
  const encoded = Buffer.from(newJson, 'utf8').toString('base64')

  // 4. Commit via GitHub Contents API
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/data/content.json`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update portfolio content via admin editor',
      content: encoded,
      sha: body.sha,
      branch: GITHUB_BRANCH,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('GitHub API error:', err)
    return NextResponse.json({ error: 'GitHub commit failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

// GET /api/content
// Returns the current content.json from GitHub.
// Requires x-admin-password header matching ADMIN_PASSWORD env var.
// This runs server-side only; no secrets reach the client.

import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN  = process.env.GITHUB_TOKEN  ?? ''
const GITHUB_OWNER  = process.env.GITHUB_OWNER  ?? ''
const GITHUB_REPO   = process.env.GITHUB_REPO   ?? ''
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? 'main'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password') ?? ''
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/data/content.json?ref=${GITHUB_BRANCH}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: 502 })
  }

  const file = await res.json() as { content: string; sha: string }
  const content = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
  return NextResponse.json({ content, sha: file.sha })
}

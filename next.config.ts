import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Explicitly set the workspace root so Next.js doesn't detect
  // the parent lockfile and warn about multiple lockfiles.
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig

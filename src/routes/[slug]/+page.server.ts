import type { EntryGenerator, PageServerLoad } from './$types'
import fs from 'node:fs/promises'
import path from 'node:path'
import { loadContent } from '$lib/server/loadContent'

// navItems come from the root layout load
export const load: PageServerLoad = async ({ params }) => {
  return loadContent(params.slug)
}

export const entries: EntryGenerator = async () => {
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)
  // Only .md files, strip .md extension for slug
  return files.filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace(/\.md$/, '') }))
}

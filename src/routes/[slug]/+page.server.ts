import type { EntryGenerator, PageServerLoad } from './$types'
import fs from 'node:fs/promises'
import path from 'node:path'
import { loadContent } from '@/lib/server/loadContent'
import matter from 'gray-matter'

export const load: PageServerLoad = async ({ params }) => {
  // Load main page content
  const content = await loadContent(params.slug)

  // Load nav menu items
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)
  const navItems = []
  for (const file of files) {
    if (!file.endsWith('.md'))
      continue
    const raw = await fs.readFile(path.join(contentDir, file), 'utf-8')
    const { data } = matter(raw)
    navItems.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title ?? '',
      navigation: data.navigation ?? '',
      order: data.order ?? 999,
      style: data.style ?? '',
    })
  }
  navItems.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  return { ...content, navItems }
}

export const entries: EntryGenerator = async () => {
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)
  // Only .md files, strip .md extension for slug
  return files.filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace(/\.md$/, '') }))
}

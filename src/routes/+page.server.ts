import fs from 'node:fs/promises'
import path from 'node:path'
import { loadContent } from '$lib/server/loadContent'
import matter from 'gray-matter'

export async function load() {
  // Load main page content
  const content = await loadContent('index')

  // Load nav menu items
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)
  const navItems = []
  for (const file of files) {
    if (!file.endsWith('.md'))
      continue
    const raw = await fs.readFile(path.join(contentDir, file), 'utf-8')
    const { data } = matter(raw)

    // Skip hidden items in navigation
    if (data.hidden === true)
      continue

    navItems.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title ?? '',
      navigation: data.navigation ?? '',
      order: data.order ?? 999,
      style: data.style ?? '',
      category: data.category ?? 'About', // Default to About if no category is specified
    })
  }
  navItems.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  return { ...content, navItems }
}

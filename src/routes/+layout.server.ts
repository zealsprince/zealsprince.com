import type { NavItem } from '$types/Content'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export const prerender = true
export const trailingSlash = 'always'

// Loaded here rather than per-page so every route, including the error page,
// gets the same menu without each one re-reading the content directory.
export async function load() {
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)

  const navItems: NavItem[] = []
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
      // The menu wants the short name, so it falls back to the hero heading
      // rather than `title`, which is the long SEO one.
      heading: data.heading ?? '',
      navigation: data.navigation ?? '',
      order: data.order ?? 999,
      style: data.style ?? '',
      category: data.category ?? 'About', // Default to About if no category is specified
    })
  }

  navItems.sort((a, b) => a.order - b.order)

  return { navItems }
}

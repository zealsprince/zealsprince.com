import fs from 'node:fs/promises'
import path from 'node:path'
import { isoDate, pageUrl } from '$lib/site'
import matter from 'gray-matter'

export const prerender = true

interface Entry {
  url: string
  lastmod?: string
  priority: string
}

export async function GET() {
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)

  const entries: Entry[] = []
  for (const file of files) {
    if (!file.endsWith('.md'))
      continue

    const raw = await fs.readFile(path.join(contentDir, file), 'utf-8')
    const { data } = matter(raw)

    // Hidden pages stay out of navigation, so keep them out of the sitemap too
    if (data.hidden === true)
      continue

    const slug = file.replace(/\.md$/, '')
    entries.push({
      url: pageUrl(slug),
      lastmod: isoDate(data.date),
      priority: slug === 'index' ? '1.0' : '0.8',
    })
  }

  entries.sort((a, b) => a.url.localeCompare(b.url))

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(entry =>
    [
      '  <url>',
      `    <loc>${entry.url}</loc>`,
      entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
      `    <priority>${entry.priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n'),
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  })
}

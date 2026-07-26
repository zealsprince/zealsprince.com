import { contentIndex, HOME_SLUG } from '$lib/server/content'
import { isoDate, pageUrl } from '$lib/site'

export const prerender = true

interface Entry {
  url: string
  lastmod?: string
  priority: string
}

/** Deeper pages get a lower priority, floored so nothing drops out of sight. */
function priorityFor(slug: string): string {
  if (slug === HOME_SLUG)
    return '1.0'

  const depth = slug.split('/').length
  return Math.max(0.5, 0.8 - (depth - 1) * 0.2).toFixed(1)
}

export async function GET() {
  const index = await contentIndex()

  const entries: Entry[] = index
    // Hidden pages stay out of navigation, so keep them out of the sitemap too
    .filter(entry => entry.frontmatter.hidden !== true)
    .map(entry => ({
      url: pageUrl(entry.slug),
      lastmod: isoDate(entry.frontmatter.date),
      priority: priorityFor(entry.slug),
    }))

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

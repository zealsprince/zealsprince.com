import type { Frontmatter } from '$types/Content'
import {
  absolute,
  isoDate,
  SITE_AUTHOR,
  SITE_AUTHOR_JOB_TITLE,
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_PROFILES,
} from './site'

// Stable node ids so the graph can cross-reference rather than repeat itself.
const PERSON_ID = `${SITE_ORIGIN}/#person`
const WEBSITE_ID = `${SITE_ORIGIN}/#website`

interface SchemaOptions {
  frontmatter: Frontmatter
  canonical: string
  title: string
  description: string
  image: string
  /** True for the site root, which is where the Person and WebSite nodes live. */
  isHome: boolean
}

/**
 * JSON-LD for the page, as a single `@graph` so the Person, the WebSite and the
 * page itself are one connected description rather than three loose objects.
 *
 * Only the homepage declares the Person and WebSite nodes. Every other page
 * points at them by id, which is what tells a crawler these pages are all the
 * same site and the same author.
 *
 * Returns the whole script element rather than the payload, the same way
 * paletteStyleTag does, so the one place that has to think about escaping is
 * here and not the template.
 */
export function structuredDataTag(options: SchemaOptions): string {
  const { frontmatter, canonical, title, description, image, isHome } = options

  const graph: Record<string, unknown>[] = []

  if (isHome) {
    graph.push({
      '@type': 'Person',
      '@id': PERSON_ID,
      'name': SITE_AUTHOR,
      'alternateName': SITE_NAME,
      'url': `${SITE_ORIGIN}/`,
      'jobTitle': SITE_AUTHOR_JOB_TITLE,
      'description': SITE_DESCRIPTION,
      'image': absolute(SITE_IMAGE),
      'sameAs': SITE_PROFILES,
    })

    graph.push({
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      'url': `${SITE_ORIGIN}/`,
      'name': SITE_NAME,
      'description': SITE_DESCRIPTION,
      'inLanguage': 'en',
      'publisher': { '@id': PERSON_ID },
    })
  }

  const published = isoDate(frontmatter.date)
  const isPost = frontmatter.category === 'Blog'

  const page: Record<string, unknown> = {
    '@type': isPost ? 'BlogPosting' : 'WebPage',
    '@id': `${canonical}#webpage`,
    'url': canonical,
    'name': title,
    'description': description,
    'inLanguage': 'en',
    'isPartOf': { '@id': WEBSITE_ID },
    'primaryImageOfPage': image,
    'author': { '@id': PERSON_ID },
  }

  if (isPost) {
    page.headline = frontmatter.heading ?? title
    page.image = image
    page.publisher = { '@id': PERSON_ID }
  }

  if (published) {
    page.datePublished = published
    page.dateModified = published
  }

  graph.push(page)

  const document = { '@context': 'https://schema.org', '@graph': graph }

  // `<` is the only character that can break out of a script element. Escaping
  // it keeps the payload valid JSON while making that impossible. The closing
  // tag is split for the same reason one level up: an intact `</script>` inside
  // a Svelte template ends the component's own script block.
  const json = JSON.stringify(document).replace(/</g, '\\u003c')

  return `<script type="application/ld+json">${json}<\/script>`
}

import type { Frontmatter } from '$types/Content'

// Canonical origin. Used to build absolute URLs for canonical links, Open Graph
// and the sitemap, all of which reject relative paths.
export const SITE_ORIGIN = 'https://zealsprince.com'

export const SITE_NAME = 'zealsprince'

export const SITE_DESCRIPTION
  = 'Andrew Lake (zealsprince) - software engineer, architect and digital artist.'

// Fallback social card for pages that don't set `image` in their frontmatter.
export const SITE_IMAGE = '/og/default.jpg'

export const SITE_LOCALE = 'en_US'

// Real name behind the handle. Used for the Person schema and the author meta.
export const SITE_AUTHOR = 'Andrew Lake'

export const SITE_AUTHOR_JOB_TITLE = 'Software Engineer and Architect'

export const SITE_TWITTER = '@zealsprince'

/**
 * Profiles for the person behind the site, used as schema.org `sameAs`.
 *
 * Deliberately a list here rather than something derived from page links. The
 * Person entity has to stay the same no matter which page a crawler lands on,
 * and project pages will link to repos and store pages that are emphatically
 * not Andrew. It costs a small duplication of URLs that also appear in content
 * frontmatter, which is the cheaper mistake.
 */
export const SITE_PROFILES = [
  'https://github.com/zealsprince',
  'https://www.linkedin.com/in/zealsprince/',
  'https://twitter.com/zealsprince',
  'https://www.instagram.com/zealsprince/',
  'https://www.artstation.com/zealsprince',
  'https://www.deviantart.com/zealsprince',
  'https://steamcommunity.com/id/zealsprince',
  'https://500px.com/p/zealsprince',
]

/**
 * gray-matter turns an unquoted `date:` into a Date and leaves a quoted one a
 * string, so both shapes reach us. Normalises either to YYYY-MM-DD, or
 * undefined when there is nothing usable.
 */
export function isoDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.valueOf()))
    return value.toISOString().slice(0, 10)

  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.valueOf()))
      return parsed.toISOString().slice(0, 10)
  }

  return undefined
}

/** Turn a root-relative path into an absolute URL. Passes through absolute URLs. */
export function absolute(path: string): string {
  if (/^https?:\/\//.test(path))
    return path

  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * The homepage's internal slug. Lives here rather than in the content indexer
 * because the client needs it too and the indexer imports `node:fs`.
 */
export const HOME_SLUG = 'index'

/**
 * Root-relative path for a content slug. Slugs are path-shaped, so `rox/nekorox`
 * becomes `/rox/nekorox/`. Matches the `trailingSlash: 'always'` kit config.
 */
export function pagePath(slug: string): string {
  return slug === HOME_SLUG ? '/' : `/${slug}/`
}

/** Absolute public URL for a content slug. */
export function pageUrl(slug: string): string {
  return `${SITE_ORIGIN}${pagePath(slug)}`
}

/**
 * The document title. Three frontmatter fields feed the three places a page
 * names itself, and they are deliberately separate:
 *
 * - `title` is the search result and browser tab, used verbatim so a page can
 *   spend the whole slot on words worth ranking for
 * - `heading` is the hero type, which wants to stay short
 * - `navigation` is the menu label, shorter still
 *
 * Without `title` we fall back to the heading plus the site name, which is fine
 * for incidental pages but wastes the slot on anything that matters.
 */
export function resolvePageTitle(frontmatter: Frontmatter | undefined): string {
  const title = frontmatter?.title?.trim()
  if (title)
    return title

  const heading = frontmatter?.heading?.trim()
  if (!heading || heading === SITE_NAME)
    return SITE_NAME

  return `${heading} - ${SITE_NAME}`
}

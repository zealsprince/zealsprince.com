// Canonical origin. Used to build absolute URLs for canonical links, Open Graph
// and the sitemap, all of which reject relative paths.
export const SITE_ORIGIN = 'https://zealsprince.com'

export const SITE_NAME = 'zealsprince'

export const SITE_DESCRIPTION
  = 'Andrew Lake (zealsprince) - software engineer, architect and digital artist.'

// Fallback social card for pages that don't set `image` in their frontmatter.
export const SITE_IMAGE = '/og/default.jpg'

export const SITE_LOCALE = 'en_US'

/** Turn a root-relative path into an absolute URL. Passes through absolute URLs. */
export function absolute(path: string): string {
  if (/^https?:\/\//.test(path))
    return path

  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

/** Public URL for a content slug. Matches the `trailingSlash: 'always'` kit config. */
export function pageUrl(slug: string): string {
  return slug === 'index' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${slug}/`
}

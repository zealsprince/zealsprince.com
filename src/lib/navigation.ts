import type { Crumb, NavItem } from '$types/Content'
import { HOME_SLUG, pagePath } from './site'

/** Turn `/rox/nekorox/` back into the slug `rox/nekorox`. */
export function slugFromPath(pathname: string): string {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '')
  return trimmed === '' ? HOME_SLUG : trimmed
}

/** Every ancestor of a slug, nearest last: `rox/nekorox` gives `['rox']`. */
export function ancestorSlugs(slug: string): string[] {
  if (slug === HOME_SLUG)
    return []

  const segments = slug.split('/')
  segments.pop()

  return segments.map((_, index) => segments.slice(0, index + 1).join('/'))
}

/**
 * The trail from the homepage down to, but not including, the current page.
 *
 * Labels come from the nav items so a crumb reads the same as the menu entry.
 * A slug with no matching nav item still gets a crumb from its own segment,
 * because a hidden parent should not break the chain above it.
 */
export function buildCrumbs(slug: string, navItems: NavItem[]): Crumb[] {
  if (slug === HOME_SLUG)
    return []

  const bySlug = new Map(navItems.map(item => [item.slug, item]))

  const label = (target: string) => {
    const item = bySlug.get(target)
    if (item)
      return item.navigation || item.heading || target

    // Fall back to the last path segment, tidied up
    const segment = target.split('/').pop() ?? target
    return segment.replace(/-/g, ' ')
  }

  const home = bySlug.get(HOME_SLUG)

  return [
    {
      slug: HOME_SLUG,
      label: home?.navigation || home?.heading || 'Home',
      href: pagePath(HOME_SLUG),
    },
    ...ancestorSlugs(slug).map(ancestor => ({
      slug: ancestor,
      label: label(ancestor),
      href: pagePath(ancestor),
    })),
  ]
}

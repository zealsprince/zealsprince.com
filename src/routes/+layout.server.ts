import { navigationItems } from '$lib/server/content'

export const prerender = true
export const trailingSlash = 'always'

// Loaded here rather than per-page so every route, including the error page,
// gets the same menu without each one re-reading the content directory.
export async function load() {
  return { navItems: await navigationItems() }
}

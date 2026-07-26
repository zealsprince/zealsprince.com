import type { EntryGenerator, PageServerLoad } from './$types'
import { contentIndex, HOME_SLUG } from '$lib/server/content'
import { loadContent } from '$lib/server/loadContent'

// navItems come from the root layout load
export const load: PageServerLoad = async ({ params }) => {
  return loadContent(params.slug)
}

export const entries: EntryGenerator = async () => {
  const index = await contentIndex()

  // The homepage has its own route, so it is not one of this route's entries.
  return index
    .filter(entry => entry.slug !== HOME_SLUG)
    .map(entry => ({ slug: entry.slug }))
}

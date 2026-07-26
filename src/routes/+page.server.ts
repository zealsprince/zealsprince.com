import { loadContent } from '$lib/server/loadContent'

// navItems come from the root layout load
export async function load() {
  return loadContent('index')
}

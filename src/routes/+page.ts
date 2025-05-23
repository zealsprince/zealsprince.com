import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data }) => {
  return {
    ...data, // Pass through data from +page.server.ts
  }
}

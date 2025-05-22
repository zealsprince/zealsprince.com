import type { EntryGenerator } from './$types'
import fs from 'node:fs/promises'
import path from 'node:path'

export const entries: EntryGenerator = async () => {
  const contentDir = path.resolve('content')
  const files = await fs.readdir(contentDir)
  // Only .md files, strip .md extension for slug
  return files.filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace(/\.md$/, '') }))
}

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, url }) => {
  const editor = url.searchParams.get('editor') === 'true';
  return {
    ...data, // Pass through data from +page.server.ts
    editor,
  };
};

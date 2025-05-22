import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, url }) => {
  const editor = url.searchParams.get('editor') === 'true';
  return {
    ...data, // Pass through data from +page.server.ts
    editor,
  };
};

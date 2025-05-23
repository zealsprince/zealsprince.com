import adapter from '@sveltejs/adapter-static' // Add this line
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // or '200.html' or '404.html'
      precompress: true,
      strict: true,
    }),
    alias: {
      '$/*': 'src/*',
      '$components/*': 'src/components/*',
      '$scenes/*': 'src/scenes/*',
      '$types/*': 'src/types/*',
    },
  },
}

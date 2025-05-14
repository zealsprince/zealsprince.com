import process from 'node:process'
import adapter from '@sveltejs/adapter-static' // Add this line
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: { // Add this section
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // or '200.html' or '404.html'
      precompress: false,
      strict: true,
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/zealsprince.com' : '',
    },
  },
}

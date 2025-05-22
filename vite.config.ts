import path from 'node:path'
import { sveltekit } from '@sveltejs/kit/vite'
import { threlteStudio } from '@threlte/studio/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [threlteStudio(), sveltekit()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

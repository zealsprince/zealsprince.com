import path from 'node:path'
import { sveltekit } from '@sveltejs/kit/vite'
import { threlteStudio } from '@threlte/studio/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [threlteStudio(), sveltekit()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '$': path.resolve(__dirname, './src'),
      '$components': path.resolve(__dirname, './src/components'),
      '$scenes': path.resolve(__dirname, './src/scenes'),
      '$types': path.resolve(__dirname, './src/types'),
    },
  },
})

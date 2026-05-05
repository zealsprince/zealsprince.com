import path from 'node:path'
import process from 'node:process'
import { sveltekit } from '@sveltejs/kit/vite'
import { createLogger, defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

const isDev = process.env.NODE_ENV !== 'production'

const logger = createLogger()
const originalWarn = logger.warn.bind(logger)
logger.warn = (msg, options) => {
  // Suppress virtual CSS module warnings from pre-compiled third-party Svelte packages
  if (msg.includes('failed to load virtual css module'))
    return
  originalWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
  plugins: [
    isDev && (await import('@threlte/studio/vite')).threlteStudio(),
    sveltekit(),
    glsl(),
  ].filter(Boolean),
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

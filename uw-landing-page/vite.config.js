import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./frontend/js', import.meta.url)),
    },
  },

  // Multi-page app
  // Không copy thư mục public
  publicDir: false,

  build: {
    // generate manifest.json in outDir
    manifest: true,

    rollupOptions: {
      base: './frontend/js/base.js',
      landing: './frontend/js/pages/landing.js',
      style: './frontend/scss/style.scss',
      landingStyle: './frontend/scss/pages/landing.scss',
    },

    outDir: 'public/build',
  },
})

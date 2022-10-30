import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  /*
  publicDir: false,

  build: {
    // generate manifest.json in outDir
    manifest: true,

    rollupOptions: {
      input: './frontend/js/script.js',
    },

    outDir: 'public/build',
  },
  */
})

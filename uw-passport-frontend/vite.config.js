import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,

  build: {
    // generate manifest.json in outDir
    manifest: true,

    rollupOptions: {
      input: './frontend/js/script.js',
    },

    outDir: 'public/build',
  },
})

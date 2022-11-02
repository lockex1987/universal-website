import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          axios: [
            // import { default as axios } from 'axios'
            ['default', 'axios'],
          ],
        },
      ],
    }),

    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})

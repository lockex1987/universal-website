import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // Không copy nội dung thư mục public (static, upload)
  // Khi phát triển thì cần
  publicDir: true,

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
      resolvers: [
        AntDesignVueResolver(),
      ],
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

  build: {
    // Bình thường khi dev có thể nhìn file vue
    // khi build thì không nhìn được
    // Phải chuyển thành true để nhìn được khi build
    sourcemap: true, // true, false, 'inline', 'hidden'
  },

  css: {
    // Bình thường khi dev không thể nhìn file scss
    // Phải thiết lập true để nhìn được khi dev
    // TODO: Để nhìn được khi build?
    devSourcemap: true,
  },
})

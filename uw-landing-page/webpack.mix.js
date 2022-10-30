const mix = require('laravel-mix')
const path = require('path')

mix.setPublicPath('public')

// Để js cũng như public/js
mix.vue()
  .js('frontend/js/base.js', 'js')
  .js('frontend/js/pages/landing.js', 'js')
  .js('frontend/js/pages/news-list.js', 'js')
  .js('frontend/js/pages/news-detail.js', 'js')
  .js('frontend/js/pages/product-list.js', 'js')
  .js('frontend/js/pages/order.js', 'js')

mix.sass('frontend/scss/style.scss', 'css')
  .sass('frontend/scss/summernote.scss', 'css')
  .sass('frontend/scss/pages/landing.scss', 'css')
  .sass('frontend/scss/pages/news-list.scss', 'css')
  .sass('frontend/scss/pages/news-detail.scss', 'css')
  .sass('frontend/scss/pages/product-list.scss', 'css')
  .sass('frontend/scss/pages/order.scss', 'css')

// TODO: Thêm version ở prod

mix.sourceMaps(true, 'source-map')

mix.webpackConfig({
  resolve: {
    alias: {
      // Điều chỉnh để import các file cho dễ
      '~': path.join(__dirname, './frontend/js'),
    },
  },

  output: {
    // Các file khác (pages) ở trong thư mục js
    // Thêm hash để không bị cache
    chunkFilename: 'js/[name].js?h=[chunkhash]',
  },

  // Sử dụng Vue toàn cục thì phải thêm cấu hình này
  externals: {
    vue: 'Vue',
  },
})

import './scss/style.scss'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './libs/noti/scss/noti.scss'
import './libs/noti/js/noti.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './libs/axios.js'

// Tiếng Việt validator của Ant Design Vue
import AsyncValidator from 'async-validator'
// console.log(AsyncValidator.messages)
// AsyncValidator.messages.required = '%s là bắt buộc'
// Bỏ qua % là tên trường, thường là dạng mã tiếng Anh
AsyncValidator.messages.required = 'Vui lòng nhập trường này'
// AsyncValidator.warning = function () {} // không disable được

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

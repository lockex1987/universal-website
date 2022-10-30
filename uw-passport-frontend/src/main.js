import './scss/style.scss'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './libs/noti/scss/noti.scss'
import './libs/noti/js/noti.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
// import vi from 'element-plus/dist/locale/vi.mjs'
import App from './App.vue'
import router from './router/index.js'
import './libs/axios.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// app.use(ElementPlus, { locale: vi })
app.mount('#app')

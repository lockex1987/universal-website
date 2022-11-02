import './scss/style.scss'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './libs/noti/scss/noti.scss'
import './libs/noti/js/noti.js'
import './libs/axios.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

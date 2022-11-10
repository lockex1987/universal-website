// import './scss/style.scss'

import * as bootstrap from 'bootstrap'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './libs/noti/js/noti.js'
import './libs/axios.js'
import './libs/async-validator.js'

import App from './App.vue'
import router from './router/index.js'

window.bootstrap = bootstrap

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

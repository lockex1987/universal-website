import './scss/style.scss'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './libs/axios.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

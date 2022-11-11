import './scss/style.scss'

import * as bootstrap from 'bootstrap'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

window.bootstrap = bootstrap

const app = createApp(App)
app.use(router)
app.mount('#app')

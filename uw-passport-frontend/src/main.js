import './scss/style.scss'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './libs/axios.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

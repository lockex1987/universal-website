import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import checkAuthentication from './checkAuthentication.js'
import checkPermission from './checkPermission.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(checkAuthentication)
router.beforeEach(checkPermission)

export default router

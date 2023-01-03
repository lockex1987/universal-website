import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import checkAuthentication from './check-authentication.js'
import checkPermission from './check-permission.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(checkAuthentication)
router.beforeEach(checkPermission)

export default router

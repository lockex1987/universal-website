import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/product/:productId',
      name: 'product',
      component: () => import('@/pages/Product.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/Cart.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/Checkout.vue'),
    },
  ],
})

export default router

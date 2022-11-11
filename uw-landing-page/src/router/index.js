import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/Home/HomeIndex.vue' // trang chính, không lazy load

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // component: () => import('@/pages/Cart/CartIndex.vue'),
    },
    {
      path: '/product/:_id',
      name: 'product',
      component: () => import('@/pages/Product/ProductIndex.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/Cart/CartIndex.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/Checkout/CheckoutIndex.vue'),
    },
  ],
})

export default router

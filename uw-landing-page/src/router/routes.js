import HomeView from '@/pages/Home/HomeIndex.vue' // trang chính, không lazy load

export default [
  {
    path: '/',
    name: 'home',
    // component: HomeView,
    component: () => import('@/pages/Cart/CartIndex.vue'),
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
]

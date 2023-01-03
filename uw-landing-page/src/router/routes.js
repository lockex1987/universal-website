import HomeView from '@/pages/home/HomeIndex.vue' // trang chính, không lazy load

export default [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    // component: () => import('@/pages/cart/CartIndex.vue'),
  },
  {
    path: '/product/:_id',
    name: 'Product',
    component: () => import('@/pages/product/ProductIndex.vue'),
  },
  /*
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/cart/CartIndex.vue'),
  },
  */
]

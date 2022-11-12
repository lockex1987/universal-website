import HomeView from '@/pages/Home/HomeIndex.vue' // trang chính, không lazy load

export default [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    // component: () => import('@/pages/Cart/CartIndex.vue'),
  },
  {
    path: '/Product/:_id',
    name: 'Product',
    component: () => import('@/pages/Product/ProductIndex.vue'),
  },
  /*
  {
    path: '/Cart',
    name: 'Cart',
    component: () => import('@/pages/Cart/CartIndex.vue'),
  },
  */
]

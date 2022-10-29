export default [
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/pages/Login/LoginIndex.vue'),
  },
  {
    path: '/Backend',
    name: 'Backend',
    component: () => import('@/pages/Backend/BackendIndex.vue'),
    children: [
      {
        path: 'Profile',
        name: 'Profile',
        component: () => import('@/pages/Profile/ProfileIndex.vue'),
      },
      /*
      {
        path: 'change-password',
        name: 'changePassword',
        component: () => import('@/pages/ChangePassword.vue'),
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('@/pages/Product.vue'),
      },
      {
        path: 'product/:productId',
        name: 'productForm',
        component: () => import('@/pages/ProductForm.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/pages/User.vue'),
      },
      {
        path: 'user/:userId',
        name: 'userForm',
        component: () => import('@/pages/UserForm.vue'),
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/pages/Order.vue'),
      },
      */
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/NotFoundIndex.vue'),
  },
]

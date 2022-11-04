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
      {
        path: 'User',
        name: 'User',
        component: () => import('@/pages/User/UserIndex.vue'),
      },
      {
        path: 'UserForm/:id',
        name: 'UserForm',
        component: () => import('@/pages/User/UserForm.vue'),
      },
      {
        path: 'DemoButton',
        name: 'DemoButton',
        component: () => import('@/pages/DemoComponents/DemoButton.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/NotFoundIndex.vue'),
  },
]

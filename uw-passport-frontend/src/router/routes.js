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
      /*
      {
        path: 'user/:userId',
        name: 'userForm',
        component: () => import('@/pages/UserForm.vue'),
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

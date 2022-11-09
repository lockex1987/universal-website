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
        path: 'Users',
        name: 'Users',
        component: () => import('@/pages/Users/UsersIndex.vue'),
      },
      {
        path: 'Orgs',
        name: 'Orgs',
        component: () => import('@/pages/Orgs/OrgsIndex.vue'),
      },
      {
        path: 'Permissions',
        name: 'Permissions',
        component: () => import('@/pages/Permissions/PermissionsIndex.vue'),
      },
      {
        path: 'Roles',
        name: 'Roles',
        component: () => import('@/pages/Roles/RolesIndex.vue'),
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

import {
  Orgs,
  Permissions,
  Roles,
  Users,
  Products,
} from '@/helpers/permissions.mjs'

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
        path: 'Dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard/DashboardIndex.vue'),
      },
      {
        path: 'Orgs',
        name: 'Orgs',
        component: () => import('@/pages/Orgs/OrgsIndex.vue'),
        meta: { permission: Orgs },
      },
      {
        path: 'Permissions',
        name: 'Permissions',
        component: () => import('@/pages/Permissions/PermissionsIndex.vue'),
        meta: { permission: Permissions },
      },
      {
        path: 'Roles',
        name: 'Roles',
        component: () => import('@/pages/Roles/RolesIndex.vue'),
        meta: { permission: Roles },
      },
      {
        path: 'Users',
        name: 'Users',
        component: () => import('@/pages/Users/UsersIndex.vue'),
        meta: { permission: Users },
      },
      {
        path: 'Products',
        name: 'Products',
        component: () => import('@/pages/Products/ProductsIndex.vue'),
        meta: { permission: Products },
      },
      {
        path: 'DemoButton',
        name: 'DemoButton',
        component: () => import('@/pages/DemoComponents/DemoButton.vue'),
      },
    ],
  },
  {
    path: '/NoPermission',
    name: 'NoPermission',
    component: () => import('@/pages/NoPermission/NoPermissionIndex.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/NotFoundIndex.vue'),
  },
]

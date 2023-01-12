import {
  Orgs,
  Permissions,
  Roles,
  Users,
  SystemConfigs,
  Products,
  ActionLogs,
  LogFiles,
  LoginSessions,
} from '@/helpers/permissions.mjs'

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/LoginIndex.vue'),
  },
  {
    path: '/backend',
    name: 'Backend',
    component: () => import('@/pages/backend/BackendIndex.vue'),
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/profile/ProfileIndex.vue'),
      },
      {
        path: 'user-logs',
        name: 'UserLogs',
        component: () => import('@/pages/user-logs/UserLogsIndex.vue'),
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/DashboardIndex.vue'),
      },
      {
        path: 'orgs',
        name: 'Orgs',
        component: () => import('@/pages/orgs/OrgsIndex.vue'),
        meta: { permission: Orgs },
      },
      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('@/pages/permissions/PermissionsIndex.vue'),
        meta: { permission: Permissions },
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/pages/roles/RolesIndex.vue'),
        meta: { permission: Roles },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/pages/users/UsersIndex.vue'),
        meta: { permission: Users },
      },
      {
        path: 'system-configs',
        name: 'SystemConfigs',
        component: () => import('@/pages/system-configs/SystemConfigsIndex.vue'),
        meta: { permission: SystemConfigs },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/pages/products/ProductsIndex.vue'),
        meta: { permission: Products },
      },
      {
        path: 'action-logs',
        name: 'ActionLogs',
        component: () => import('@/pages/action-logs/ActionLogsIndex.vue'),
        meta: { permission: ActionLogs },
      },
      {
        path: 'log-files',
        name: 'LogFiles',
        component: () => import('@/pages/log-files/LogFilesIndex.vue'),
        meta: { permission: LogFiles },
      },
      {
        path: 'login-sessions',
        name: 'LoginSessions',
        component: () => import('@/pages/login-sessions/LoginSessionsIndex.vue'),
        meta: { permission: LoginSessions },
      },
      {
        path: 'demo-button',
        name: 'DemoButton',
        component: () => import('@/pages/demo-components/DemoButton.vue'),
      },
      {
        path: 'demo-tree',
        name: 'DemoTree',
        component: () => import('@/pages/demo-components/DemoTree.vue'),
      },
      {
        path: 'demo-tree-select',
        name: 'DemoTreeSelect',
        component: () => import('@/pages/demo-components/DemoTreeSelect.vue'),
      },
      {
        path: 'demo-date-picker',
        name: 'DemoDatePicker',
        component: () => import('@/pages/demo-components/DemoDatePicker.vue'),
      },
    ],
  },
  {
    path: '/no-permission',
    name: 'NoPermission',
    component: () => import('@/pages/no-permission/NoPermissionIndex.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/not-found/NotFoundIndex.vue'),
  },
]

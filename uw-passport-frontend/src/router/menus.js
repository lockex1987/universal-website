export default [
  { code: 'Dashboard', name: 'Dashboard' },
  {
    code: 'Admin',
    name: 'Quản trị',
    children: [
      { code: 'Orgs', name: 'Tổ chức', permission: 'Orgs' },
      { code: 'Permissions', name: 'Quyền', permission: 'Permissions' },
      { code: 'Roles', name: 'Vai trò', permission: 'Roles' },
      { code: 'Users', name: 'Người dùng', permission: 'Users' },
    ],
  },
  {
    code: 'Demo',
    name: 'Demo',
    children: [
      { code: 'DemoButton', name: 'Demo Button' },
    ],
  },
]

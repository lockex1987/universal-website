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
  { code: 'Dashboard', name: 'Dashboard' },
  {
    code: 'Admin',
    name: 'Quản trị',
    children: [
      { code: 'Orgs', name: 'Tổ chức', permission: Orgs },
      { code: 'Permissions', name: 'Quyền', permission: Permissions },
      { code: 'Roles', name: 'Vai trò', permission: Roles },
      { code: 'Users', name: 'Người dùng', permission: Users },
      { code: 'SystemConfigs', name: 'Cấu hình hệ thống', permission: SystemConfigs },
      { code: 'ActionLogs', name: 'Log tác động', permission: ActionLogs },
      { code: 'LogFiles', name: 'File log', permission: LogFiles },
      { code: 'LoginSessions', name: 'Phiên đăng nhập', permission: LoginSessions },
    ],
  },
  {
    code: 'Category',
    name: 'Danh mục',
    children: [
      { code: 'Products', name: 'Sản phẩm', permission: Products },
    ],
  },
  {
    code: 'Demo',
    name: 'Demo',
    children: [
      { code: 'DemoButton', name: 'Demo Button' },
      { code: 'DemoTree', name: 'Demo Tree' },
      { code: 'DemoTreeSelect', name: 'Demo Tree Select' },
      { code: 'DemoDatePicker', name: 'Demo Date Picker' },
    ],
  },
]

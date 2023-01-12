import auth from './auth.mjs'
import profile from './profile.mjs'
import dashboard from './dashboard.mjs'
import orgs from './orgs.mjs'
import roles from './roles.mjs'
import users from './users.mjs'
import systemConfigs from './system-configs.mjs'
import products from './products.mjs'
import actionLogs from './action-logs.mjs'
import userLogs from './user-logs.mjs'
import logFiles from './log-files.mjs'
import loginSessions from './login-sessions.mjs'

import {
  Orgs,
  Roles,
  Users,
  SystemConfigs,
  Products,
  ActionLogs,
  LogFiles,
  LoginSessions,
} from '#app/helpers/permissions.mjs'

export default [
  { path: '/auth', router: auth, auth: false, permission: null },
  { path: '/profile', router: profile, auth: true, permission: null },
  { path: '/user-logs', router: userLogs, auth: true, permission: null },
  { path: '/dashboard', router: dashboard, auth: true, permission: null },
  { path: '/orgs', router: orgs, auth: true, permission: Orgs },
  { path: '/roles', router: roles, auth: true, permission: Roles },
  { path: '/users', router: users, auth: true, permission: Users },
  { path: '/system-configs', router: systemConfigs, auth: true, permission: SystemConfigs },
  { path: '/products', router: products, auth: true, permission: Products },
  { path: '/action-logs', router: actionLogs, auth: true, permission: ActionLogs },
  { path: '/log-files', router: logFiles, auth: true, permission: LogFiles },
  { path: '/login-sessions', router: loginSessions, auth: true, permission: LoginSessions },
]

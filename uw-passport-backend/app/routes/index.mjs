import authRouter from './auth.mjs'
import profileRouter from './profile.mjs'
import usersRouter from './users.mjs'
import orgsRouter from './orgs.mjs'
import permissionsRouter from './permissions.mjs'

export default [
  { path: '/auth', router: authRouter, auth: false, permission: null },
  { path: '/profile', router: profileRouter, auth: true, permission: null },
  { path: '/users', router: usersRouter, auth: true, permission: 'Users' },
  { path: '/orgs', router: orgsRouter, auth: true, permission: 'Orgs' },
  { path: '/permissions', router: permissionsRouter, auth: true, permission: 'Permissions' },
]

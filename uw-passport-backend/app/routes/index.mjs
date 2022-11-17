import auth from './auth.mjs'
import profile from './profile.mjs'
import dashboard from './dashboard.mjs'
import orgs from './orgs.mjs'
import permissions from './permissions.mjs'
import roles from './roles.mjs'
import users from './users.mjs'
import products from './products.mjs'

import {
  Orgs,
  Permissions,
  Roles,
  Users,
  Products,
} from '#app/helpers/permissions.mjs'

export default [
  { path: '/auth', router: auth, auth: false, permission: null },
  { path: '/profile', router: profile, auth: true, permission: null },
  { path: '/dashboard', router: dashboard, auth: true, permission: null },
  { path: '/orgs', router: orgs, auth: true, permission: Orgs },
  { path: '/permissions', router: permissions, auth: true, permission: Permissions },
  { path: '/roles', router: roles, auth: true, permission: Roles },
  { path: '/users', router: users, auth: true, permission: Users },
  { path: '/products', router: products, auth: true, permission: Products },
]

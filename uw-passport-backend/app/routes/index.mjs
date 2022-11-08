import authRouter from './auth.mjs'
import profileRouter from './profile.mjs'
import userRouter from './user.mjs'
import orgRouter from './org.mjs'
import permissionRouter from './permission.mjs'
import productRouter from './product.mjs'

export default [
  { path: '/auth', router: authRouter, auth: false, permission: null },
  { path: '/profile', router: profileRouter, auth: true, permission: null },
  { path: '/user', router: userRouter, auth: true, permission: 'user' },
  { path: '/org', router: orgRouter, auth: true, permission: 'org' },
  { path: '/permission', router: permissionRouter, auth: true, permission: 'permission' },
  { path: '/product', router: productRouter, auth: true, permission: 'product' },
]

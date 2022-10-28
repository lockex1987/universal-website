import authRouter from './auth.mjs'
import todoRouter from './todo.mjs'
import productRouter from './product.mjs'
import profileRouter from './profile.mjs'
import userRouter from './user.mjs'

export default [
  { path: '/auth', router: authRouter },
  { path: '/todo', router: todoRouter },
  { path: '/product', router: productRouter },
  { path: '/profile', router: profileRouter },
  { path: '/user', router: userRouter },
]

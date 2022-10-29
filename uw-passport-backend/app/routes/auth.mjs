import bcrypt from 'bcrypt'
import express from 'express'
import { ObjectId } from 'mongodb'
import {
  getUser,
  removeUser,
  saveUser,
} from '#app/helpers/auth.mjs'
import { getDb } from '#app/helpers/mongodb.mjs'

const router = express.Router()

/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{ "username": "lockex1987", "password": "123456aA@" }' \
  http://localhost:3000/auth/login
*/
router.post('/login', async (request, response, next) => {
  // throw new Error('Login') // do là async nên không vào handle500, nếu muốn vào thì có thể sử dụng Express 5
  // next(new Error('Login')) // phải làm thế này mới vào handle500

  const rules = {
    username: 'required|string', // |unique:users,username
    password: 'required|string', // |strongPassword
  }
  await request.validate(request.body, rules)

  const { username, password } = request.body
  const db = getDb()
  // Có phân biệt hoa thường
  const user = await db.collection('users')
    // .findOne({ username })
    // .findOne({ username: new RegExp('^' + username + '$', 'i') })
    .findOne({ username: { $regex: '^' + username + '$', $options: 'i' } })
    /*
    .collation({
      locale: 'en',
      strength: 2
    })
    */
  if (! user) {
    return response.json({
      code: 1,
      message: 'Login failed',
    })
  }

  if (! bcrypt.compareSync(password, user.password)) {
    // throw new Error('Login failed 2 ')
    return response.json({
      code: 1,
      message: 'Login failed',
    })
  }

  // Save into Redis
  // TODO: Cookie
  const redisUser = {
    id: user._id,
    username: user.username,
  }
  const token = await saveUser(redisUser, request)

  response.json({
    code: 0,
    message: 'Login success',
    user: redisUser,
    token,
  })
})

router.post('/logout', async (request, response) => {
  await removeUser(request)
  response.json({
    code: 0,
    message: 'Logout',
  })
})

router.get('/me', async (request, response) => {
  const redisUser = await getUser(request)
  if (! redisUser) {
    return response.json({
      code: 1,
      message: 'Not in Redis',
    })
  }

  const db = getDb()
  const dbUser = await db.collection('users').findOne({ _id: ObjectId(redisUser.id) })
  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Not in DB',
    })
  }

  response.json({
    code: 0,
    user: redisUser,
  })
})

export default router

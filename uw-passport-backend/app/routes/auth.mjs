import bcrypt from 'bcrypt'
import express from 'express'
import { ObjectId } from 'mongodb'
import {
  generateRandomSessionId,
  getUser,
  removeUser,
  saveUser,
} from '#app/helpers/auth.mjs'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()

router.post('/login', async (request, response, next) => {
  const rules = {
    username: 'required|string',
    password: 'required|string',
  }
  await request.validate(request.body, rules)

  const { username, password } = request.body
  const db = getDb()
  const user = await db.collection('users')
    .findOne({ username: { $regex: '^' + username + '$', $options: 'i' } })

  if (! user) {
    return response.json({
      code: 1,
      message: 'Login failed',
    })
  }

  if (! bcrypt.compareSync(password, user.password)) {
    return response.json({
      code: 1,
      message: 'Login failed',
    })
  }

  // Save into Redis, cookie
  const redisUser = {
    id: user._id,
    username: user.username,
  }
  const sessionId = generateRandomSessionId()
  await saveUser(redisUser, request, sessionId)

  response.cookie('sessionId', sessionId, {
    // Theo milli giây
    maxAge: 120 * 60 * 1000,
    // expires works the same as the maxAge
    // expires: new Date('01 12 2023'),
    secure: false,
    // secure: true,
    // Dùng JS document.cookie sẽ không ra
    httpOnly: true,
    sameSite: 'lax',
    // sameSite: 'none', // cần secure
    // signed: false,
    // domain: 'http://localhost:3000'
    // domain: 'localhost',
  })

  response.json({
    code: 0,
    message: 'Login success',
    user: redisUser,
  })
})

router.post('/logout', async (request, response) => {
  await removeUser(request)

  response.clearCookie('sessionId')

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
  const id = redisUser.id
  const dbUser = await db.collection('users').findOne({ _id: ObjectId(id) })
  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Not in DB',
    })
  }

  response.json({
    code: 0,
    user: {
      ...pick(dbUser, 'username'),
      id,
    },
  })
})

export default router

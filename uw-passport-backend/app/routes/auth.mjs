import bcrypt from 'bcrypt'
import express from 'express'
import { ObjectId } from 'mongodb'
import {
  generateRandomSessionId,
  getUser,
  removeUser,
  saveUser,
  setCookie,
  clearCookie,
} from '#app/helpers/auth.mjs'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()

router.post('/login', async (request, response, next) => {
  const rules = {
    username: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
  }
  await request.validate(request.body, rules)

  const { username, password } = request.body
  const db = getDb()
  const query = {
    username: {
      $regex: '^' + username + '$',
      $options: 'i',
    },
  }
  const dbUser = await db.collection('users')
    .findOne(query)

  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Login failed',
    })
  }

  if (! bcrypt.compareSync(password, dbUser.password)) {
    return response.json({
      code: 1,
      message: 'Login failed',
    })
  }

  // Save into Redis, cookie
  const redisUser = {
    ...pick(dbUser, 'username', 'fullName', 'email', 'phone', 'avatar', 'thumbnail', '_id'),
  }
  const sessionId = generateRandomSessionId()
  // 10 ngày
  const expiredTimeSeconds = 10 * 24 * 60 * 60
  await saveUser(redisUser, request, sessionId, expiredTimeSeconds)

  setCookie(response, sessionId, expiredTimeSeconds)

  response.json({
    code: 0,
    message: 'Login success',
    user: redisUser,
  })
})

router.post('/logout', async (request, response) => {
  await removeUser(request)
  clearCookie(response)
  response.json({
    code: 0,
    message: 'Logout',
  })
})

router.get('/me', async (request, response) => {
  const redisUser = await getUser(request)
  if (! redisUser) {
    clearCookie(response)
    return response.json({
      code: 1,
      message: 'Not in Redis',
    })
  }

  const db = getDb()
  const _id = redisUser._id
  const dbUser = await db.collection('users').findOne({ _id: ObjectId(_id) })
  if (! dbUser) {
    await removeUser(request)
    clearCookie(response)
    return response.json({
      code: 1,
      message: 'Not in DB',
    })
  }

  response.json({
    code: 0,
    user: {
      ...pick(dbUser, 'username', 'fullName', 'email', 'phone', 'avatar', 'thumbnail', '_id'),
    },
  })
})

export default router

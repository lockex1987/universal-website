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


router.post('/login', async (request, response) => {
  const rules = {
    username: { required: true },
    password: { required: true },
  }
  await request.validate(request.body, rules)

  const { username, password } = request.body
  const db = getDb()
  const query = { username: { $regex: '^' + username.toLowerCase() + '$', $options: 'i' } }
  const dbUser = await db.collection('users').findOne(query)

  if (! dbUser || ! dbUser.isActive || dbUser.deletedAt) {
    return response.json({
      code: 1,
      message: 'Đăng nhập thất bại',
    })
  }

  if (! bcrypt.compareSync(password, dbUser.password)) {
    return response.json({
      code: 1,
      message: 'Đăng nhập thất bại',
    })
  }

  const permissions = await getUserPermissions(dbUser._id)

  const redisUser = pick(dbUser, 'username', 'fullName', 'email', 'phone', 'avatar', 'thumbnail', '_id')
  redisUser.permissions = permissions
  const sessionId = generateRandomSessionId()
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
  const objId = ObjectId(_id)
  const dbUser = await db.collection('users').findOne({ _id: objId })
  if (! dbUser) {
    await removeUser(request)
    clearCookie(response)
    return response.json({
      code: 1,
      message: 'Not in MongoDB',
    })
  }

  response.json({
    code: 0,
    user: redisUser,
  })
})


const getUserPermissions = async objId => {
  const db = getDb()
  const arr = await db.collection('users').aggregate([
    { $match: { _id: objId } },
    { $lookup: { from: 'roles', localField: 'roles', foreignField: '_id', as: 'rolesCol' } },
  ])
    .toArray()

  const permissions = []
  arr.forEach(user => {
    user.rolesCol.forEach(role => {
      role.permissions.forEach(p => {
        permissions.push(p)
      })
    })
  })
  return permissions
}


export default router

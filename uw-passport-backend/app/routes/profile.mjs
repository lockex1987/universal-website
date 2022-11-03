import express from 'express'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { getUser } from '#app/helpers/auth.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()

router.post('/change-password', async (request, response) => {
  const rules = {
    oldPassword: {
      type: 'string',
      required: true,
    },
    newPassword: [
      {
        type: 'string',
        required: true,
      },
      {
        type: 'strongPassword',
      },
    ],
  }
  await request.validate(request.body, rules)

  const { oldPassword, newPassword } = request.body
  const redisUser = await getUser(request)

  const db = getDb()
  const dbUser = await db.collection('users').findOne({ _id: ObjectId(redisUser.id) })
  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Người dùng không tồn tại',
    })
  }

  if (! bcrypt.compareSync(oldPassword, dbUser.password)) {
    return response.json({
      code: 1,
      message: 'Mật khẩu cũ không chính xác',
    })
  }

  const rounds = 10
  const hashedPassword = bcrypt.hashSync(newPassword, rounds)
  const query = { _id: ObjectId(redisUser.id) }
  const data = { password: hashedPassword }
  const result = await db.collection('users').updateOne(query, { $set: data })

  response.json({
    code: 0,
    message: 'Đổi mật khẩu thành công',
    result,
  })
})

router.post('/update-user-info', async (request, response) => {
  const rules = {
    fullName: [{ required: true }],
    email: [{ type: 'email', required: true }],
    phone: [{ required: false, min: 9, max: 12 }],
  }
  await request.validate(request.body, rules)

  const redisUser = await getUser(request)
  const db = getDb()
  const query = { _id: ObjectId(redisUser.id) }
  const dbUser = await db.collection('users').findOne(query)

  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Người dùng không tồn tại',
    })
  }

  const data = pick(request.body, 'fullName', 'email', 'phone')
  await db.collection('users').updateOne(query, { $set: data })
  response.json({
    code: 0,
    message: 'Updated',
  })
})

export default router

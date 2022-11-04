import express from 'express'
import bcrypt from 'bcrypt'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { getUser } from '#app/helpers/auth.mjs'
import { pick, getBasePath } from '#app/helpers/common.mjs'

const router = express.Router()

router.post('/change-password', async (request, response) => {
  const rules = {
    oldPassword: [{ type: 'string', required: true }],
    newPassword: [
      { type: 'string', required: true },
      { type: 'strongPassword' },
    ],
  }
  await request.validate(request.body, rules)

  const { oldPassword, newPassword } = request.body
  const redisUser = await getUser(request)

  const db = getDb()
  const dbUser = await db.collection('users').findOne({ _id: ObjectId(redisUser._id) })
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
  const query = { _id: ObjectId(redisUser._id) }
  const data = { password: hashedPassword }
  const result = await db.collection('users').updateOne(query, { $set: data })

  response.json({
    code: 0,
    message: 'Đổi mật khẩu thành công',
    result,
  })
})

router.post('/update-user-info', async (request, response) => {
  // Đang bị lỗi source.hasOwnProperty is not a function
  request.body.hasOwnProperty = Object.prototype.hasOwnProperty
  const rules = {
    fullName: [{ type: 'string', required: true }],
    email: [{ type: 'email', required: true }],
    phone: [{ type: 'string', required: false, min: 9, max: 12 }],
    avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5 }],
  }
  await request.validate(request.body, rules)

  const redisUser = await getUser(request)
  const db = getDb()
  const query = { _id: ObjectId(redisUser._id) }
  const dbUser = await db.collection('users').findOne(query)

  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Người dùng không tồn tại',
    })
  }

  const avatarFile = request.files?.avatar
  let avatarPath = dbUser.avatar
  if (avatarFile) {
    const extension = path.extname(avatarFile.name)
      .substring(1)
      .toLowerCase()
    const uuid = crypto.randomUUID()
    const basePath = getBasePath()
    avatarPath = 'upload/' + uuid + '.' + extension

    await avatarFile.mv(basePath + avatarPath)

    // Xóa ảnh cũ
    if (dbUser.avatar) {
      fs.unlink(basePath + dbUser.avatar)
    }
  }

  const data = pick(request.body, 'fullName', 'email', 'phone')
  if (avatarPath) {
    data.avatar = avatarPath
  }
  await db.collection('users').updateOne(query, { $set: data })
  response.json({
    code: 0,
    message: 'Updated',
    avatar: avatarPath,
  })
})

export default router

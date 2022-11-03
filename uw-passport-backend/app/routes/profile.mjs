import express from 'express'
import bcrypt from 'bcrypt'
import path from 'node:path'
import crypto from 'node:crypto'
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
  // Đang bị lỗi source.hasOwnProperty is not a function
  request.body.hasOwnProperty = Object.prototype.hasOwnProperty
  const rules = {
    fullName: [{ type: 'string', required: true }],
    email: [{ type: 'email', required: true }],
    phone: [{ type: 'string', required: false, min: 9, max: 12 }],
  }
  await request.validate(request.body, rules)

  const avatarFile = request.files?.avatar
  let avatarPath = null
  if (avatarFile) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
    if (avatarFile.size > MAX_FILE_SIZE) {
      return response.json({
        code: 1,
        message: 'File too big',
      })
    }

    const ALLOW_EXTENSIONS = ['png', 'jpg', 'jpeg']
    const extension = path.extname(avatarFile.name)
      .substring(1)
      .toLowerCase()
    if (! ALLOW_EXTENSIONS.includes(extension)) {
      return response.json({
        code: 1,
        message: 'Extension not allowed',
      })
    }

    // Trường name đã được xử lý qua SAFE_FILE_NAME_REGEX = /[^\w-]/g nên không sợ các ký tự đặc biệt như .. và null
    const uuid = crypto.randomUUID()
    avatarPath = 'upload/' + uuid + '-' + avatarFile.name
    const uploadPath = getBasePath() + avatarPath

    const err = await avatarFile.mv(uploadPath)
    if (err) {
      console.error(err)
      return response.jon({
        code: 1,
        message: 'Lỗi lưu file',
      })
    }
  }

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

import express from 'express'
import bcrypt from 'bcrypt'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { ObjectId } from 'mongodb'
import Jimp from 'jimp'
import { getDb } from '#app/helpers/mongodb.mjs'
import { getUser } from '#app/helpers/auth.mjs'
import { pick, getBasePath } from '#app/helpers/common.mjs'

/**
 * Resize ảnh avatar upload sử dụng Jimp cover.
 * Sử dụng jimp tiện hơn sharp.
 * Resize, crop, maintain ratio (cover).
 * Convert to JPG.
 * Reduce quality -> reduce size.
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {number} width
 * @param {number} height
 */
const resizeImage = async (inputPath, outputPath, width, height) => {
  const image = await Jimp.read(inputPath)
  image.cover(width, height)
  await image.writeAsync(outputPath)
}

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
  const rules = {
    fullName: [{ type: 'string', required: true }],
    email: [{ type: 'email', required: true }],
    phone: [{ type: 'string', required: false, min: 9, max: 12 }],
    avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5, request }],
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
  let thumbnailPath = dbUser.thumbnail
  if (avatarFile) {
    const basePath = getBasePath()

    // Xóa ảnh cũ
    dbUser.avatar && fs.unlink(basePath + dbUser.avatar)
    dbUser.thumbnail && fs.unlink(basePath + dbUser.thumbnail)

    // Thêm ảnh mới
    const randomName = crypto.randomUUID()
    const extension = path.extname(avatarFile.name).toLowerCase()
    avatarPath = 'upload/' + randomName + extension
    await avatarFile.mv(basePath + avatarPath)

    // Ảnh nhỏ
    const width = 24
    const height = 24
    thumbnailPath = 'upload/' + randomName + `-${width}x${height}` + extension
    await resizeImage(basePath + avatarPath, basePath + thumbnailPath, width, height)
  }

  const data = pick(request.body, 'fullName', 'email', 'phone')
  if (avatarFile) {
    data.avatar = avatarPath
    data.thumbnail = thumbnailPath
  }
  await db.collection('users').updateOne(query, { $set: data })
  response.json({
    code: 0,
    message: 'Updated',
    avatar: avatarPath,
    thumbnail: thumbnailPath,
  })
})

export default router

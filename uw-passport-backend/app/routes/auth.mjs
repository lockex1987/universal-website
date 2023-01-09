import bcrypt from 'bcrypt'
import express from 'express'
import { ObjectId } from 'mongodb'
import { authenticator } from 'otplib'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import {
  generateRandomSessionId,
  getUser,
  removeUser,
  saveUser,
  setCookie,
  clearCookie,
} from '#app/helpers/auth.mjs'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick, getIp } from '#app/helpers/common.mjs'
import { encrypt, decrypt } from '#app/helpers/encryption.mjs'
import redis from '#app/helpers/redis.mjs'
import { code as appCode } from '#config/app.mjs'
import rateLimit from '#app/middleware/rate-limit.mjs'

const router = express.Router()

const maxConsecutiveFails = 5

const consecutiveFailsLimiter = new RateLimiterRedis({
  redis,
  keyPrefix: 'login_fail_consecutive',
  points: maxConsecutiveFails,
  duration: 1 * 60, // có thể sai 5 lần trong 1 phút
  blockDuration: 5 * 60, // khóa 5 phút
})

/**
 * Tăng số lần đăng nhập thất bại.
 * @param {string} ip Địa chỉ IP
 * @returns {Promise<void>} false nếu cần thông báo lỗi request quá nhiều, true nếu có thể xử lý tiếp
 */
const increaseFailAttempt = async ip => {
  try {
    // Tạo Redis với key là login_fail_consecutive:<ip> (nếu chưa có)
    // và value là số lần đăng nhập sai.
    // Sau đó tăng số lần đăng nhập sai lên 1.
    // Thời gian ttl là duration nếu chưa bị khóa, hoặc blockDuration nếu đã bị khóa.
    await consecutiveFailsLimiter.consume(ip)
  } catch (ex) {
    if (ex instanceof Error) {
      // Có thể bị lỗi kết nối Redis
      throw ex
    } else {
      // Lỗi 'Too Many Requests' ở đây
    }
  }
}


// rateLimit('login_fail_consecutive', maxConsecutiveFails, 1 * 60)
router.post('/login', async (request, response) => {
  const rules = {
    username: { required: true },
    password: { required: true },
  }
  await request.validate(rules)

  const ip = getIp(request)
  const rlRes = await consecutiveFailsLimiter.get(ip)

  if (rlRes !== null
    && rlRes.consumedPoints > maxConsecutiveFails) {
    const retrySecs = Math.round(rlRes.msBeforeNext / 1000) || 1
    response
      .json({
        code: 1,
        message: 'Gọi request quá nhiều, vui lòng thử lại sau ' + retrySecs + ' giây',
      })
    return
  }

  const { username, password, totpCode } = request.body
  const db = getDb()
  const query = { username: { $regex: '^' + username.toLowerCase() + '$', $options: 'i' } }
  const dbUser = await db.collection('users').findOne(query)

  if (! dbUser || ! dbUser.isActive || dbUser.deletedAt) {
    await increaseFailAttempt(ip)
    response.json({
      code: 1,
      message: 'Đăng nhập thất bại',
    })
    return
  }

  if (! bcrypt.compareSync(password, dbUser.password)) {
    await increaseFailAttempt(ip)
    response.json({
      code: 1,
      message: 'Đăng nhập thất bại',
    })
    return
  }

  if (! dbUser.isActive) {
    await increaseFailAttempt(ip)
    response.json({
      code: 1,
      message: 'Người dùng đang bị khóa',
    })
    return
  }

  const { totp } = dbUser
  if (totp.enabled) {
    let plainSecret
    if (! totp.secret) {
      plainSecret = authenticator.generateSecret()

      totp.secret = encrypt(plainSecret)
      await db.collection('users').updateOne(query, { $set: { totp } })
    } else {
      plainSecret = decrypt(totp.secret)
    }

    if (! totpCode) {
      if (totp.shouldShow) {
        // Chỉ hiển thị một lần
        totp.shouldShow = false
        await db.collection('users').updateOne(query, { $set: { totp } })

        const uri = authenticator.keyuri(dbUser.username, appCode, plainSecret)

        response.json({
          code: 2,
          message: 'Hiển thị mã QR',
          totp: {
            // ...totp,
            uri,
          },
        })
        return
      }

      response.json({
        code: 3,
        message: 'Vui lòng nhập mã TOTP',
      })
      return
    } else {
      if (! authenticator.check(totpCode, plainSecret)) {
        await increaseFailAttempt(ip)
        response.json({
          code: 1,
          message: 'Mã TOTP không chính xác',
        })
        return
      }
    }
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
    { $match: {
      _id: objId,
    } },

    { $lookup: {
      from: 'roles',
      localField: 'roles',
      foreignField: '_id',
      as: 'rolesCol',
    } },
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

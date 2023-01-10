import crypto from 'node:crypto'
import redis from '#app/helpers/redis.mjs'
import { code } from '#config/app.mjs'

const getSessionId = request => {
  const sessionId = request.cookies?.sessionId
  return sessionId ?? ''
}

const getRedisKeyFromSessionId = (sessionId, request) => {
  // Thêm IP của người dùng để nếu lỡ bị lộ thông tin token thì cũng không thực hiện được ở máy khác
  const ip = (request.header('x-forwarded-for') || request.socket.remoteAddress).replace('::ffff:', '')
  const redisKey = code + '-session:' + sessionId + '-' + ip
  return redisKey
}

const getRedisKeyFromRequest = request => {
  const sessionId = getSessionId(request)
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  return redisKey
}

const generateRandomSessionId = () => {
  const uuid = crypto.randomUUID()
  const random = crypto.randomBytes(40).toString('hex')
  const token = uuid + random
  return token
}

const removeUser = async request => {
  const redisKey = getRedisKeyFromRequest(request)
  await redis.del(redisKey)
}

const getUser = async request => {
  const redisKey = getRedisKeyFromRequest(request)
  const redisValue = await redis.get(redisKey)
  const user = ! redisValue ? null : JSON.parse(redisValue)
  return user
}

const saveUser = async (user, request, sessionId, expiredTimeSeconds) => {
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  const redisValue = JSON.stringify({
    ...user,
    expiredTime: expiredTimeSeconds,
  })
  await redis.set(redisKey, redisValue, 'EX', expiredTimeSeconds)
}

const updateExpiredTime = async (sessionId, expiredTimeSeconds, request) => {
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  await redis.expire(redisKey, expiredTimeSeconds)
}

const setCookie = (response, sessionId, expiredTimeSeconds) => {
  response.cookie('sessionId', sessionId, {
    // Theo milli giây
    maxAge: expiredTimeSeconds * 1000,
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
}

const clearCookie = response => {
  response.clearCookie('sessionId')
}

export {
  generateRandomSessionId,
  getSessionId,

  saveUser,
  getUser,
  removeUser,
  updateExpiredTime,

  setCookie,
  clearCookie,
}

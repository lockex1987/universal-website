import crypto from 'node:crypto'
import redis from '#app/helpers/redis.mjs'
import { getIp } from '#app/helpers/common.mjs'
import { code } from '#config/app.mjs'

export const getSessionId = request => {
  const sessionId = request.cookies?.sessionId
  return sessionId ?? ''
}

const getRedisKeyFromSessionId = (sessionId, request) => {
  // Thêm IP của người dùng để nếu lỡ bị lộ thông tin token thì cũng không thực hiện được ở máy khác
  const ip = getIp(request)
  const redisKey = code + '-session:' + sessionId + '-' + ip
  return redisKey
}

export const getRedisKeyFromRequest = request => {
  const sessionId = getSessionId(request)
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  return redisKey
}

export const generateRandomSessionId = () => {
  const uuid = crypto.randomUUID() // có 36 ký tự
  const bytesNum = 40
  const s = crypto.randomBytes(bytesNum).toString('hex') // có bytesNum * 2 = 80 ký tự
  return uuid + s
}

export const removeUser = async request => {
  const redisKey = getRedisKeyFromRequest(request)
  await redis.del(redisKey)
}

export const getUser = async request => {
  if (request._alreadyGetUser) {
    return request._cachedUser
  }

  const redisKey = getRedisKeyFromRequest(request)
  const redisValue = await redis.get(redisKey)
  const user = ! redisValue ? null : JSON.parse(redisValue)

  request._alreadyGetUser = true
  request._cachedUser = user

  return user
}

export const saveUser = async (user, request, sessionId, expiredTimeSeconds) => {
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  const redisValue = JSON.stringify({
    ...user,
    expiredTime: expiredTimeSeconds,
  })
  await redis.set(redisKey, redisValue, 'EX', expiredTimeSeconds)
}

export const updateUser = async (user, request) => {
  const redisKey = getRedisKeyFromRequest(request)
  const redisValue = await redis.get(redisKey)
  const redisUser = JSON.parse(redisValue)
  const expiredTimeSeconds = redisUser.expiredTime
  await redis.set(redisKey, JSON.stringify(user), 'EX', expiredTimeSeconds)
}

export const updateExpiredTime = async (sessionId, expiredTimeSeconds, request) => {
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  await redis.expire(redisKey, expiredTimeSeconds)
}

export const setCookie = (response, sessionId, expiredTimeSeconds) => {
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

export const clearCookie = response => {
  response.clearCookie('sessionId')
}

import crypto from 'node:crypto'
// import { webcrypto as crypto } from 'node:crypto'
import redis from '#app/helpers/redis.mjs'
import { code } from '#config/app.mjs'

const getSessionId = request => {
  const sessionId = request.cookies?.sessionId
  return sessionId ?? ''
}

const getRedisKeyFromSessionId = (token, request) => {
  // Thêm IP của người dùng để nếu lỡ bị lộ thông tin token thì cũng không thực hiện được ở máy khác
  const ip = (request.header('x-forwarded-for') || request.socket.remoteAddress).replace('::ffff:', '')
  const redisKey = code + '-session:' + token + '-' + ip
  return redisKey
}

const getRedisKeyFromRequest = request => {
  const sessionId = getSessionId(request)
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  return redisKey
}

const generateRandomSessionId = () => {
  const uuid = crypto.randomUUID()
  // console.log(uuid)

  // TODO: Cần dài hơn
  /*
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const num = array[0]
  */
  // console.log(num)
  const num = ''

  // const n2 = crypto.randomBytes(40).toString('hex')
  // console.log(n2)

  const token = uuid + num
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

const saveUser = async (user, request, sessionId) => {
  // Đơn vị giây (10 ngày)
  const expiredTime = 10 * 24 * 60 * 60
  const redisKey = getRedisKeyFromSessionId(sessionId, request)
  const redisValue = JSON.stringify({
    id: user.id,
    username: user.username,
    expiredTime,
  })
  await redis.set(redisKey, redisValue, 'EX', expiredTime)
}

export {
  generateRandomSessionId,

  saveUser,
  getUser,
  removeUser,
}

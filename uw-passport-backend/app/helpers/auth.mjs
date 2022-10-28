// import crypto from 'node:crypto' // Node.js old
// Same as browser
import { webcrypto as crypto } from 'node:crypto'
import redis from '#app/helpers/redis.mjs'
import { code } from '#config/app.mjs'

/**
 * Lấy giá trị token từ request (trong header).
 */
const getToken = request => {
  const token = (request.header('Authorization') ?? '').replace('Bearer ', '')
  return token
}

/**
 * Lấy ra Redis key để lưu token.
 */
const getRedisKeyFromToken = (token, request) => {
  // Thêm IP của người dùng để nếu lỡ bị lộ thông tin token thì cũng không thực hiện được ở máy khác
  const ip = (request.header('x-forwarded-for') || request.socket.remoteAddress).replace('::ffff:', '')
  return code + '-session:' + token + '-' + ip
}

/**
 * Lấy Redis key từ request hiện tại.
 */
const getRedisKeyFromRequest = request => {
  const token = getToken(request)
  const redisKey = getRedisKeyFromToken(token, request)
  return redisKey
}

/**
 * Sinh token ngẫu nhiên.
 * @return {string}
 */
const generateRandomToken = () => {
  const uuid = crypto.randomUUID()
  // console.log(uuid)

  // TODO: Cần dài hơn
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const num = array[0]
  // console.log(num)

  // const n2 = crypto.randomBytes(40).toString('hex')
  // console.log(n2)

  const token = uuid + num
  return token
}

/**
 * Loại bỏ thông tin người dùng khỏi Redis.
 * Sử dụng khi đăng xuất.
 */
const removeUser = async request => {
  const redisKey = getRedisKeyFromRequest(request)
  await redis.del(redisKey)
}

/**
 * Lấy thông tin người dùng hiện tại (đang được lưu ở Redis).
 */
const getUser = async request => {
  const redisKey = getRedisKeyFromRequest(request)
  const redisValue = await redis.get(redisKey)
  const user = ! redisValue ? null : JSON.parse(redisValue)
  return user
}

/**
 * Lưu thông tin người dùng vào Redis (id, userName).
 * Sử dụng sau khi đăng nhập thành công.
 */
const saveUser = async (user, request) => {
  const token = generateRandomToken()

  // Sinh code và lưu ở Redis trong 10 ngày
  const expiredTime = 10 * 24 * 60 * 60
  const redisKey = getRedisKeyFromToken(token, request)
  const redisValue = JSON.stringify({
    id: user.id,
    username: user.username,
    expiredTime,
  })
  await redis.set(redisKey, redisValue, 'EX', expiredTime)

  return token
}

export {
  saveUser,
  getUser,
  removeUser,
}

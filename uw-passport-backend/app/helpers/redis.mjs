import { createClient } from 'redis'

/**
 * Tạo kết nối.
 * Trả về đối tượng Redis.
 */
function createRedisClient() {
  const redisClient = createClient()

  redisClient.on('connect', () => {
    // TODO: Log
    console.log('Redis connected')
  })

  redisClient.on('error', err => {
    // TODO: Log
    console.log('Đã có lỗi xảy ra')
    console.error(err)
  })

  return redisClient
}

const redisClient = createRedisClient()

export default redisClient

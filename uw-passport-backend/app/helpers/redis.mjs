import { createClient } from 'redis'

/**
 * Tạo kết nối.
 * Trả về đối tượng Redis.
 */
function init() {
  const redis = createClient()

  redis.on('connect', () => {
    // TODO: Log
    console.log('Redis connected')
  })

  redis.on('error', err => {
    // TODO: Log
    console.log('Đã có lỗi xảy ra')
    console.error(err)
  })

  return redis
}

const redis = init()

export default redis

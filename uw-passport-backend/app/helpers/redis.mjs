import { createClient } from 'redis'

/**
 * Tạo kết nối.
 * Trả về đối tượng Redis.
 */
function init() {
  const redis = createClient({
    // package 'rate-limiter-flexible' cần cấu hình này, nếu không sẽ bị lỗi 'TypeError: this.client.multi(...).get(...).pttl is not a function'
    legacyMode: true,
  })

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

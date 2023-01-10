import { createClient } from 'redis'
import logger from '#app/helpers/logger.mjs'

const init = legacyMode => {
  const redis = createClient({
    // Package 'rate-limiter-flexible' cần cấu hình này, nếu không sẽ bị lỗi 'TypeError: this.client.multi(...).get(...).pttl is not a function'
    // Tuy nhiên lại bị lỗi khi login do các hàm của Redis giờ là callback, không phải Promise
    // https://github.com/animir/node-rate-limiter-flexible/wiki/Redis
    // Package 'rate-limiter-flexible' không hỗ trợ node-redis version 4
    legacyMode,
  })

  redis.on('connect', () => {
    logger.info('Redis connected with legacy mode ' + legacyMode)
  })

  redis.on('error', err => {
    logger.error(err)
  })

  return redis
}

const redis = init(false)
const redisV3 = init(true)

await redis.connect()
redisV3.connect()

export default redis // V4
export { redisV3 }

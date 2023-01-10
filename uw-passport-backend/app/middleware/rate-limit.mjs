import { RateLimiterRedis } from 'rate-limiter-flexible'
import { redisV3 as redis } from '#app/helpers/redis.mjs'
import { getIp } from '#app/helpers/common.mjs'

/**
 * Rate limit middleware.
 * @param {string} keyPrefix
 * @param {number} points
 * @param {number} duration Số giây
 * @param {number} blockDuration Số giây, nếu không nhập thì bằng duration
 * @returns {Function}
 */
const rateLimit = (keyPrefix, points, duration, blockDuration) => {
  if (! blockDuration) {
    blockDuration = duration
  }
  const limiter = new RateLimiterRedis({
    redis,
    keyPrefix,
    points,
    duration,
    blockDuration,
  })

  const func = (request, response, next) => {
    const ip = getIp(request)
    limiter.consume(ip)
      .then(() => {
        next()
      })
      .catch(ex => {
        if (ex instanceof Error) {
          // Có thể bị lỗi kết nối Redis
          throw ex
        } else {
          const retrySecs = Math.round(ex.msBeforeNext / 1000) || 1
          response
            .json({
              code: 1,
              message: 'Gọi request quá nhiều, vui lòng thử lại sau ' + retrySecs + ' giây',
            })
        }
      })
  }

  return func
}

export default rateLimit

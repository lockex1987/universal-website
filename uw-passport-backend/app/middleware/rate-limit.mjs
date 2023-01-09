import { RateLimiterRedis } from 'rate-limiter-flexible'
import redis from '#app/helpers/redis.mjs'

const rateLimit = (keyPrefix, points, duration) => {
  const limiter = new RateLimiterRedis({
    redis,
    keyPrefix,
    points,
    duration,
  })

  const func = (request, response, next) => {
    limiter.consume(request.ip)
      .then(() => {
        next()
      })
      .catch(() => {
        response
          .status(429)
          .send('Too Many Requests')
      })
  }

  return func
}

export default rateLimit

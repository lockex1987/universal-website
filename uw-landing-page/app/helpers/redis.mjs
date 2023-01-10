import { createClient } from 'redis'
import logger from '#app/helpers/logger.mjs'

const init = () => {
  const redis = createClient()

  redis.on('connect', () => {
    logger.info('Redis connected')
  })

  redis.on('error', err => {
    logger.error(err)
  })

  return redis
}

const redis = init()

await redis.connect()

export default redis

import express from 'express'
import redis from '#app/helpers/redis.mjs'
import { code } from '#config/app.mjs'

const router = express.Router()


router.get('/list-sessions', async (request, response) => {
  const pattern = code + '-session:*'
  const options = {
    TYPE: 'string', // SCAN only
    MATCH: pattern,
    COUNT: 100,
  }
  const sessionList = []
  for await (const key of redis.scanIterator(options)) {
    const redisUser = await redis.get(key)
    sessionList.push({
      key,
      user: JSON.parse(redisUser),
    })
  }
  response.json(sessionList)
})


router.post('/delete-session', async (request, response) => {
  const { key } = request.body
  await redis.del(key)
  response.json({ code: 0 })
})


export default router

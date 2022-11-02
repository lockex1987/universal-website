import express from 'express'
import { getDb } from '#app/helpers/mongodb.mjs'

const router = express.Router()

router.post('/search', async (request, response) => {
  const { text, page, size } = request.body

  const query = {}
  if (text) {
    query.username = {
      $regex: text,
      $options: 'i',
    }
  }
  const order = { _id: -1 }
  const db = getDb()
  // TODO: Không trả về các thông tin nhạy cảm như mật khẩu
  const projection = { password: 0 }

  const col = db.collection('users')
  const total = await col.count(query)

  const list = await col
    .find(query, projection)
    // .projection(projection)
    .sort(order)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()

  response.json({
    total,
    list,
  })
})

export default router

import express from 'express'
import { getDb } from '#app/helpers/mongodb.mjs'

const paginate = async (col, page, size, query, order, projection) => {
  const total = await col.count(query)

  const list = await col
    .find(query, projection)
    // .projection(projection)
    .sort(order)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()

  return {
    total,
    list,
  }
}

const router = express.Router()

// curl "http://localhost:3000/user/search?search=&page=1&size=10"
router.get('/search', async (request, response) => {
  const search = request.query.search
  const page = parseInt(request.query.page)
  const size = parseInt(request.query.size)

  const query = {}
  if (search) {
    query.username = { $regex: search, $options: 'i' }
  }
  const order = { _id: -1 }
  const db = getDb()
  // TODO: Không trả về các thông tin nhạy cảm như mật khẩu
  const projection = { password: 0 }
  const pagi = await paginate(db.collection('users'), page, size, query, order, projection)
  response.json(pagi)
})

export default router

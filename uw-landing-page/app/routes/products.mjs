import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'

const router = express.Router()

// curl http://localhost:4000/api/products/search | jq .
router.get('/search', async (request, response) => {
  const db = getDb()
  const query = {}
  const total = await db.collection('products').count(query)
  const list = await db.collection('products')
    .find(query)
    .skip(0)
    .limit(100)
    .toArray()
  response.json({
    total,
    list,
  })
})

router.get('/detail/:_id', async (request, response) => {
  const { _id } = request.params
  const db = getDb()
  const query = { _id: ObjectId(_id) }
  const product = await db.collection('products').findOne(query)
  response.json(product)
})

export default router

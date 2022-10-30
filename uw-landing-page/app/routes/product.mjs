import express from 'express'
import { getDb } from '#app/helpers/mongodb.mjs'

const router = express.Router()

/*
curl http://localhost:3000/product/search
*/
router.get('/search', async (request, response) => {
  const db = getDb()
  const productList = await db.collection('products')
    .find()
    .skip(0)
    .limit(100)
    .toArray()

  // Ở frontend đang sử dụng trường "id", không phải "_id"
  productList.forEach(product => {
    product.id = product._id
  })

  response.json({
    code: 0,
    data: productList,
  })
})

export default router

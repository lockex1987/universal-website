import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()


router.post('/search', async (request, response) => {
  const { text, page, size } = request.body

  const query = {}
  if (text) {
    const temp = { $regex: text, $options: 'i' }
    query.$or = [
      { title: temp },
      { description: temp },
    ]
  }

  const db = getDb()
  const col = db.collection('products')
  const total = await col.count(query)

  const sort = { title: 1 }
  const list = await col
    .find(query)
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()

  response.json({
    total,
    list,
  })
})


router.post('/insert', async (request, response) => {
  const rules = {
    title: [
      { required: true, max: 200 },
      { type: 'unique', dbCol: 'products', fullField: 'Tên' },
    ],
    description: [{ required: true, max: 500 }],
    content: [{ required: true, max: 5000 }],
    image: [{ type: 'url', required: true, max: 500 }],
    price: [{ type: 'number', required: true, max: 1_000_000_000, min: 0 }],
  }
  await request.validate(rules)

  // TODO: sanitize HTML content
  // jitbit/HtmlSanitizer: Fast JavaScript HTML Sanitizer, client-side (i.e. needs a browser, won't work in Node and other backend)
  // https://github.com/jitbit/HtmlSanitizer

  const data = pick(request.body, 'title', 'description', 'content', 'price', 'image')
  const db = getDb()
  const result = await db.collection('products').insertOne(data)

  response.json({
    code: 0,
    message: 'Inserted ' + result.insertedId,
  })
})


router.put('/update', async (request, response) => {
  const { _id } = request.body
  const objId = ObjectId(_id)
  const rules = {
    title: [
      { required: true, max: 200 },
      { type: 'unique', dbCol: 'products', fullField: 'Tên', ignoredIdValue: objId },
    ],
    description: [{ required: true, max: 500 }],
    content: [{ required: true, max: 5000 }],
    image: [{ type: 'url', required: true, max: 500 }],
    price: [{ type: 'number', required: true, max: 1_000_000_000, min: 0 }],
  }
  await request.validate(rules)

  // TODO: sanitize HTML content

  const query = { _id: objId }
  const data = pick(request.body, 'title', 'description', 'content', 'price', 'image')
  const db = getDb()
  const result = await db.collection('products').updateOne(query, { $set: data })

  response.json({
    code: 0,
    message: 'Updated ' + result.modifiedCount,
  })
})


router.delete('/delete/:_id', async (request, response) => {
  const { _id } = request.params
  const objId = ObjectId(_id)
  const query = { _id: objId }
  const db = getDb()
  const result = await db.collection('products').deleteOne(query)

  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})


export default router

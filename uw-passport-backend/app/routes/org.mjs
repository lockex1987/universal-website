import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()

router.post('/search', async (request, response) => {
  const { text, page, size, selectedOrg } = request.body

  const query = {}
  if (text) {
    const temp = { $regex: text, $options: 'i' }
    query.$or = [
      { name: temp },
      { description: temp },
    ]
  }
  selectedOrg && (query.parentId = ObjectId(selectedOrg))

  const order = { _id: -1 }
  const db = getDb()
  const col = db.collection('orgs')
  const total = await col.count(query)

  const list = await col
    .find(query)
    .sort(order)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()

  response.json({
    total,
    list,
  })
})

// Export cho các route khác sử dụng, chỗ chọn tổ chức
export const getAllOrg = async (request, response) => {
  const db = getDb()
  const list = await db.collection('orgs').find()
    .toArray()
  response.json(list)
}

router.get('/get-all', getAllOrg)

router.post('/insert', async (request, response) => {
  const { parentId } = request.body
  const data = pick(request.body, 'name', 'description')
  parentId && (data.parentId = ObjectId(parentId))
  const db = getDb()
  const result = await db.collection('orgs').insertOne(data)
  response.json({
    code: 0,
    message: 'Inserted',
    _id: result.insertedId,
  })
})

router.put('/update', async (request, response) => {
  const { _id, parentId } = request.body
  const query = { _id: ObjectId(_id) }
  const data = pick(request.body, 'name', 'description')
  parentId && (data.parentId = ObjectId(parentId))
  const db = getDb()
  const result = await db.collection('orgs').updateOne(query, { $set: data })
  response.json({
    code: 0,
    message: 'Updated ' + result.modifiedCount,
  })
})

router.delete('/delete/:_id', async (request, response) => {
  const { _id } = request.params
  const query = { _id: ObjectId(_id) }
  const db = getDb()
  const result = await db.collection('orgs').deleteOne(query)
  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})

export default router

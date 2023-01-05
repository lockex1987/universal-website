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
      { code: temp },
      { name: temp },
    ]
  }

  const db = getDb()
  const col = db.collection('roles')
  const sort = { _id: -1 }

  // Lấy tất cả các bản ghi khi export Excel
  if (size == -1) {
    const list = await col
      .find(query)
      .sort(sort)
      .toArray()
    response.json({
      list,
    })
    return
  }

  const total = await col.count(query)
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


export const getAllRoles = async (request, response) => {
  const db = getDb()
  const list = await db.collection('roles').find()
    .sort({ name: 1 })
    .toArray()
  response.json(list)
}

// router.get('/get-all', getAllRoles)


router.post('/insert', async (request, response) => {
  const rules = {
    code: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'roles', dbFieldName: 'Mã' },
    ],
    name: [{ required: true, max: 100 }],
  }
  await request.validate(rules)

  const data = pick(request.body, 'code', 'name')
  data.permissions = request.body.permissions
  const db = getDb()
  const result = await db.collection('roles').insertOne(data)

  response.json({
    code: 0,
    message: 'Inserted ' + result.insertedId,
  })
})


router.put('/update', async (request, response) => {
  const { _id } = request.body
  const rules = {
    code: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'roles', dbFieldName: 'Mã', ignoredIdValue: ObjectId(_id) },
    ],
    name: [{ required: true, max: 100 }],
  }
  await request.validate(rules)

  const query = { _id: ObjectId(_id) }
  const data = pick(request.body, 'code', 'name')
  data.permissions = request.body.permissions
  const db = getDb()
  const result = await db.collection('roles').updateOne(query, { $set: data })

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
  const result = await db.collection('roles').deleteOne(query)

  db.collection('users').updateMany(
    { roles: objId },
    { $pull: { roles: objId } },
  )

  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})


export default router

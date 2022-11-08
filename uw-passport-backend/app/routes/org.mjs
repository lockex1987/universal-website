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
  const rules = {
    name: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'orgs' },
    ],
    description: [{ max: 500 }],
    parentId: [{ type: 'exist', dbCol: 'orgs' }],
  }
  await request.validate(request.body, rules)

  const { parentId } = request.body
  const data = pick(request.body, 'name', 'description')
  parentId && (data.parentId = ObjectId(parentId))
  const db = getDb()

  if (parentId) {
    // TODO: validate exist
    const parentObj = await db.collection('orgs').findOne({ _id: ObjectId(parentId) })
    if (! parentObj) {
      return {
        code: 1,
        message: 'Đối tượng cha không tồn tại',
      }
    }
  }

  const result = await db.collection('orgs').insertOne(data)
  await updatePaths()
  response.json({
    code: 0,
    message: 'Inserted',
    _id: result.insertedId,
  })
})

router.put('/update', async (request, response) => {
  const { _id, parentId } = request.body

  const rules = {
    name: [
      // TODO: Đang không thông báo được tiếng Việt
      { required: true, max: 100 },
      // { type: 'telephone' },
      // TODO: Đang không thông báo được gì luôn
      { type: 'unique', dbCol: 'orgs', ignoredIdValue: ObjectId(_id) },
    ],
    description: [{ max: 500 }],
    parentId: [{ type: 'exist', dbCol: 'orgs' }],
  }
  await request.validate(request.body, rules)

  const query = { _id: ObjectId(_id) }
  const data = pick(request.body, 'name', 'description')
  parentId && (data.parentId = ObjectId(parentId))

  const db = getDb()

  if (parentId) {
    // TODO: validate exist
    const parentObj = await db.collection('orgs').findOne({ _id: ObjectId(parentId) })
    if (! parentObj) {
      return {
        code: 1,
        message: 'Đối tượng cha không tồn tại',
      }
    }

    // if ((parentObj.ancestors ?? []).includes(_id)) {
    if ((parentObj.path ?? '').includes('/' + _id + '/')) {
      return {
        code: 1,
        message: 'Quan hệ vòng tròn',
      }
    }
  }

  const result = await db.collection('orgs').updateOne(query, { $set: data })
  await updatePaths()
  response.json({
    code: 0,
    message: 'Updated ' + result.modifiedCount,
  })
})

router.delete('/delete/:_id', async (request, response) => {
  // TODO: Chú ý cần xóa cả các bản ghi con
  // Hoặc để các bản ghi con ra ngoài

  const { _id } = request.params
  const query = { _id: ObjectId(_id) }
  const db = getDb()
  const result = await db.collection('orgs').deleteOne(query)
  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})

const updatePaths = async () => {
  const db = getDb()
  const data = await db.collection('orgs').find().toArray()
  generatePathOfRootNodes(data)
  for (const row of data) {
    const query = { _id: row._id }
    const data = { path: row.path, ancestors: row.ancestors }
    await db.collection('orgs').updateOne(query, { $set: data })
  }
}

const generatePathOfRootNodes = data => {
  data.forEach(e => {
    if (! e.parentId) {
      e.ancestors = [e._id.toString()]
      e.path = '/' + e._id + '/'
      generatePathOfChildren(data, e)
    }
  })
}

const generatePathOfChildren = (data, parent) => {
  data.forEach(e => {
    // Vì là đối tượng ObjectId nên cần chuyển sang string
    if (e.parentId && e.parentId.toString() == parent._id.toString()) {
      e.ancestors = [...parent.ancestors, e._id.toString()]
      e.path = parent.path + e._id + '/'
      generatePathOfChildren(data, e)
    }
  })
}

export default router

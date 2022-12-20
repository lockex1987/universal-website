import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()


router.post('/search', async (request, response) => {
  const { text, selectedOrg, page, size } = request.body

  const query = {}
  if (text) {
    const temp = { $regex: text, $options: 'i' }
    query.$or = [
      { name: temp },
      { description: temp },
    ]
  }
  selectedOrg && (query.path = { $regex: '/' + selectedOrg + '/' })

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


export const getAllOrgs = async (request, response) => {
  const db = getDb()
  const list = await db.collection('orgs').find()
    .toArray()
  response.json(list)
}

router.get('/get-all', getAllOrgs)


router.post('/insert', async (request, response) => {
  const rules = {
    name: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'orgs' },
    ],
    description: [{ max: 500 }],
    parentId: [{ type: 'exist', dbCol: 'orgs', dbFieldName: 'Tổ chức cha' }],
  }
  await request.validate(request.body, rules)

  const { parentId } = request.body
  const data = pick(request.body, 'name', 'description')
  data.parentId = parentId ? ObjectId(parentId) : null
  const db = getDb()
  const result = await db.collection('orgs').insertOne(data)

  // await updatePaths()

  const _id = result.insertedId
  let ancestors
  let path
  if (parentId) {
    const parentObj = await db.collection('orgs').findOne({ _id: ObjectId(parentId) })
    ancestors = [...parentObj.ancestors, _id.toString()]
    path = parentObj.path + _id.toString() + '/'
  } else {
    ancestors = [_id.toString()]
    path = '/' + _id + '/'
  }
  const updateData = {
    ancestors,
    path,
  }
  await db.collection('orgs').updateOne({ _id }, { $set: updateData })

  response.json({
    code: 0,
    message: 'Inserted',
    _id,
  })
})


router.put('/update', async (request, response) => {
  const { _id, parentId } = request.body
  const rules = {
    name: [
      // TODO: Đang không thông báo được tiếng Việt
      { required: true, max: 100 },
      // TODO: Đang không thông báo được gì luôn
      { type: 'unique', dbCol: 'orgs', ignoredIdValue: ObjectId(_id), dbFieldName: 'Tên' },
    ],
    description: [{ max: 500 }],
    parentId: [{ type: 'exist', dbCol: 'orgs', dbFieldName: 'Tổ chức cha' }],
  }
  await request.validate(request.body, rules)

  const db = getDb()
  let parentObj
  if (parentId) {
    parentObj = await db.collection('orgs').findOne({ _id: ObjectId(parentId) })

    // (parentObj.ancestors ?? []).includes(_id)
    if ((parentObj.path ?? '').includes('/' + _id + '/')) {
      return {
        code: 1,
        message: 'Quan hệ vòng tròn',
      }
    }
  }

  const query = { _id: ObjectId(_id) }
  const row = await db.collection('orgs').findOne(query)
  if (! row) {
    return {
      code: 1,
      message: 'Bản ghi không tồn tại',
    }
  }

  const shouldUpdatePaths = (parentId ?? '') != (row.parentId?.toString() ?? '')

  const data = pick(request.body, 'name', 'description')
  data.parentId = parentId ? ObjectId(parentId) : null

  const result = await db.collection('orgs').updateOne(query, { $set: data })

  if (shouldUpdatePaths) {
    await updatePaths()

    // TODO: Chỉ cập nhật chính nó và con cháu
    // let ancestors
    // let path
  }

  response.json({
    code: 0,
    message: 'Updated ' + result.modifiedCount,
  })
})


router.delete('/delete/:_id', async (request, response) => {
  const { _id } = request.params
  const objId = ObjectId(_id)
  const db = getDb()

  // Chú ý cần xóa cả các bản ghi con
  // Hoặc để các bản ghi con ra ngoài

  // await db.collection('orgs').deleteMany({ path: { $regex: '/' + _id + '/' } })

  const orgObj = await db.collection('orgs').findOne({ _id: objId })
  await db.collection('orgs').updateMany(
    { parentId: objId },
    { $set: { parentId: orgObj.parentId } },
  )

  const result = await db.collection('orgs')
    .deleteOne({ _id: objId })

  await updatePaths()

  // Cập nhật khóa ngoại chỗ người dùng
  db.collection('users').updateMany(
    { orgId: objId },
    { $set: { orgId: null } },
  )

  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})


router.post('/update-paths', async (request, response) => {
  updatePaths()
  response.json({
    code: 0,
    message: 'Updated',
  })
})


const updatePaths = async () => {
  /*
  db.orgs.aggregate([
    { $project: {
      _id: 1,
      name: 1,
      parentId: 1,
    } },

    { $graphLookup: {
      from: 'orgs',
      startWith: '$parentId',
      connectFromField: 'parentId',
      connectToField: '_id',
      as: 'parent',
    } },
  ])
  */
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


const generatePathOfChildren = (data, parentObj) => {
  data.forEach(e => {
    // Vì là đối tượng ObjectId nên cần chuyển sang string
    if (parentObj._id.equals(e.parentId)) {
      e.ancestors = [...parentObj.ancestors, e._id.toString()]
      e.path = parentObj.path + e._id.toString() + '/'
      generatePathOfChildren(data, e)
    }
  })
}


export default router

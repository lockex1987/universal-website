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
      { username: temp },
      { fullName: temp },
      { email: temp },
      { phone: temp },
    ]
  }

  const sort = { _id: -1 }
  const db = getDb()
  // Không trả về các thông tin nhạy cảm như mật khẩu
  const project = {
    _id: 1,
    username: 1,
    fullName: 1,
    email: 1,
    phone: 1,
    avatar: 1,
    thumbnail: 1,
    orgId: 1,
    // password: 0
  }

  const col = db.collection('users')
  const total = await col.count(query)

  const list = await col
    /*
    .find(query)
    .project(project)
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
    */
    .aggregate([
      {
        $match: query,
      },
      {
        $sort: sort,
      },
      {
        $skip: (page - 1) * size,
      },
      {
        $limit: size,
      },
      {
        $lookup:
          {
            from: 'orgs',
            localField: 'orgId',
            foreignField: '_id',
            as: 'org',
          },
      },
      {
        $project: {
          ...project,
          org: { $arrayElemAt: ['$org', 0] },
        },
      },
    ])
    .toArray()

  response.json({
    total,
    list,
  })
})

// Export cho các route khác sử dụng, chỗ chọn người dùng
export const getAllUser = async (request, response) => {
  const db = getDb()
  // Không trả về các thông tin nhạy cảm như mật khẩu
  const project = {
    _id: 1,
    username: 1,
    fullName: 1,
    email: 1,
    phone: 1,
    avatar: 1,
    thumbnail: 1,
    orgId: 1,
    // password: 0
  }
  const list = await db.collection('users').find()
    .project(project)
    .toArray()
  response.json(list)
}

router.get('/get-all', getAllUser)

router.get('/get/:_id', async (request, response) => {
  const { _id } = request.params
  const db = getDb()
  const query = { _id: ObjectId(_id) }
  // Không trả về các thông tin nhạy cảm như mật khẩu
  const project = {
    _id: 1,
    username: 1,
    fullName: 1,
    email: 1,
    phone: 1,
    avatar: 1,
    thumbnail: 1,
    orgId: 1,
    // password: 0,
  }
  // Nếu làm giống mongosh như dưới thì vẫn trả về password
  // const row = await db.collection('users').findOne(query, projection)
  const row = await db.collection('users').findOne(query, { projection: project })
  response.json(row)
})

router.post('/insert', async (request, response) => {
  const rules = {
    username: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'users', dbFieldName: 'Tên đăng nhập' },
    ],
    fullName: [{ max: 100 }],
    email: [{ max: 100 }],
    phone: [{ max: 100 }],
  }
  await request.validate(request.body, rules)

  const { orgId } = request.body
  const data = pick(request.body, 'username', 'fullName', 'email', 'phone', 'orgId')
  orgId && (data.orgId = ObjectId(orgId))
  const db = getDb()
  const result = await db.collection('users').insertOne(data)

  response.json({
    code: 0,
    message: 'Inserted',
    _id: result.insertedId,
  })
})

router.put('/update', async (request, response) => {
  const { _id, orgId } = request.body
  const rules = {
    username: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'users', dbFieldName: 'Tên đăng nhập', ignoredIdValue: ObjectId(_id) },
    ],
    fullName: [{ max: 100 }],
    email: [{ max: 100 }],
    phone: [{ max: 100 }],
  }
  await request.validate(request.body, rules)

  const query = { _id: ObjectId(_id) }
  const data = pick(request.body, 'username', 'fullName', 'email', 'phone')
  orgId && (data.orgId = ObjectId(orgId))
  const db = getDb()
  const result = await db.collection('users').updateOne(query, { $set: data })

  response.json({
    code: 0,
    message: 'Updated ' + result.modifiedCount,
  })
})

router.delete('/delete/:_id', async (request, response) => {
  const { _id } = request.params
  const query = { _id: ObjectId(_id) }
  const db = getDb()
  const result = await db.collection('users').deleteOne(query)
  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})

export default router

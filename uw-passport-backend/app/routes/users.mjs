import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'
import { getAllOrgs } from './orgs.mjs'
import { getAllRoles } from './roles.mjs'

const router = express.Router()


router.post('/search', async (request, response) => {
  const { text, page, size } = request.body

  const query = { deletedAt: null }
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
    isActive: 1,
    roles: 1,
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
      { $match: query },
      { $sort: sort },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $lookup: {
          from: 'orgs',
          localField: 'orgId',
          foreignField: '_id',
          as: 'org',
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roleList',
        },
      },
      {
        $project: {
          ...project,
          org: { $arrayElemAt: ['$org', 0] },
          roleList: 1,
        },
      },
    ])
    .toArray()

  response.json({
    total,
    list,
  })
})


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
    isActive: 1,
    roles: 1,
    // password: 0
  }
  const query = { deletedAt: null }
  const list = await db.collection('users').find(query)
    .project(project)
    .toArray()
  response.json(list)
}


router.get('/get-all-orgs', getAllOrgs)


router.get('/get-all-roles', getAllRoles)


router.post('/insert', async (request, response) => {
  const rules = {
    username: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'users', dbFieldName: 'Tên đăng nhập' },
    ],
    fullName: [{ required: true, max: 100 }],
    email: [{ type: 'email', required: true, max: 100 }],
    phone: [{ min: 9, max: 12 }],
    avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5, request }],
    orgId: [{ required: true }],
  }
  await request.validate(request.body, rules)

  const { orgId, isActive, roles } = request.body
  const data = pick(request.body, 'username', 'fullName', 'email', 'phone')
  data.orgId = orgId ? ObjectId(orgId) : null
  data.isActive = (isActive == 'true')
  data.roles = JSON.parse(roles).map(r => ObjectId(r))
  const db = getDb()
  const result = await db.collection('users').insertOne(data)

  response.json({
    code: 0,
    message: 'Inserted',
    _id: result.insertedId,
  })
})


router.put('/update', async (request, response) => {
  const { _id, orgId, isActive, roles } = request.body
  const rules = {
    username: [
      { required: true, max: 100 },
      { type: 'unique', dbCol: 'users', dbFieldName: 'Tên đăng nhập', ignoredIdValue: ObjectId(_id) },
    ],
    fullName: [{ required: true, max: 100 }],
    email: [{ type: 'email', required: true, max: 100 }],
    phone: [{ min: 9, max: 12 }],
    avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5, request }],
    orgId: [{ required: true }],
  }
  await request.validate(request.body, rules)

  const query = { _id: ObjectId(_id) }
  const data = pick(request.body, 'username', 'fullName', 'email', 'phone')
  data.orgId = orgId ? ObjectId(orgId) : null
  data.isActive = (isActive == 'true')
  data.roles = JSON.parse(roles).map(r => ObjectId(r))
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
  // const result = await db.collection('users').deleteOne(query)
  // Collection users được ánh xạ từ nhiều chỗ, không nên xóa thực sự
  const data = { deletedAt: new Date() }
  const result = await db.collection('users').updateOne(query, { $set: data })
  response.json({
    code: 0,
    message: 'Deleted ' + result.modifiedCount, // deletedCount
  })
})


export default router

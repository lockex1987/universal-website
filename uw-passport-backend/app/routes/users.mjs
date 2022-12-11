import express from 'express'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
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
  const projection = {
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
    'totp.enabled': 1, // không hiển thị secret
    // password: 0
  }

  const col = db.collection('users')
  const total = await col.count(query)

  const list = await col.aggregate([
    { $match: query },
    { $sort: sort },
    { $skip: (page - 1) * size },
    { $limit: size },
    { $lookup: { from: 'orgs', localField: 'orgId', foreignField: '_id', as: 'org' } },
    { $lookup: { from: 'roles', localField: 'roles', foreignField: '_id', as: 'roleList' } },
    { $project: { ...projection, org: { $arrayElemAt: ['$org', 0] }, roleList: 1 } },
  ])
    .toArray()

  response.json({
    total,
    list,
  })
})


export const getAllUsers = async (request, response) => {
  const db = getDb()
  // Không trả về các thông tin nhạy cảm như mật khẩu
  const projection = {
    _id: 1,
    username: 1,
    fullName: 1,
    /*
    email: 1,
    phone: 1,
    avatar: 1,
    thumbnail: 1,
    orgId: 1,
    isActive: 1,
    roles: 1,
    'totp.enabled': 1, // không hiển thị secret
    */
    // password: 0
  }
  const query = { deletedAt: null }
  const list = await db.collection('users')
    // .find(query)
    .find(query, { projection }) // không hiển thị password
    // .project(projection) // không hiển thị password
    .toArray()
  response.json(list)
}


// router.get('/get-all-users', getAllUsers)


router.get('/get-all-orgs', getAllOrgs)


router.get('/get-all-roles', getAllRoles)


router.post('/insert', async (request, response) => {
  const { body } = request
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
    password: [
      { required: true, max: 100 },
      { type: 'strongPassword' },
    ],
  }
  await request.validate(body, rules)

  const { orgId, isActive, roles, password } = body
  const data = pick(body, 'fullName', 'email', 'phone')
  data.username = body.username.toLowerCase()
  data.orgId = orgId ? ObjectId(orgId) : null
  data.isActive = (isActive == 'true')
  data.roles = JSON.parse(roles).map(r => ObjectId(r))
  data['totp.enabled'] = (body.totp_enabled === 'true')
  data.password = bcrypt.hashSync(password, 10)
  const db = getDb()
  const result = await db.collection('users').insertOne(data)

  response.json({
    code: 0,
    message: 'Inserted',
    _id: result.insertedId,
  })
})


router.put('/update', async (request, response) => {
  const { body } = request
  const { _id, orgId, isActive, roles, password } = body
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
    password: [
      { max: 100 },
      { type: 'strongPassword' },
    ],
  }
  await request.validate(body, rules)

  const query = { _id: ObjectId(_id) }
  const data = pick(body, 'fullName', 'email', 'phone')
  data.username = body.username.toLowerCase()
  data.orgId = orgId ? ObjectId(orgId) : null
  data.isActive = (isActive == 'true')
  data.roles = JSON.parse(roles).map(r => ObjectId(r))
  data['totp.enabled'] = (body.totp_enabled === 'true')
  if (password) {
    data.password = bcrypt.hashSync(password, 10)
  }
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

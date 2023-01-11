import express from 'express'
import { ObjectId } from 'mongodb'
import db from '#app/helpers/mongodb.mjs'
import { actionLogTypes } from '#app/helpers/action-logs.mjs'
import { getAllUsers } from './users.mjs'

const router = express.Router()


const filter = request => {
  const { userId, username, ip, createdFrom, createdTo } = request.body

  const query = {}
  if (userId) {
    query.userId = ObjectId(userId)
  }
  if (username) {
    // TODO: lookup collection users
  }
  if (ip) {
    query.ip = { $regex: ip, $options: 'i' }
  }
  if (createdFrom) {
    // query.createdAt = { $gte: createdFrom }
  }
  if (createdTo) {
    // query.createdAt = { $gte: createdTo }
  }
  return query
}


router.get('/action-log-types', (request, response) => {
  response.json(actionLogTypes)
})


router.get('/get-all-users', getAllUsers)


router.post('/search', async (request, response) => {
  const { page, size } = request.body
  const query = filter(request)
  const col = db.collection('actionLogs')
  const sort = { _id: -1 }

  /*
  const list = await col.aggregate([
    { $match: query },
    { $sort: sort },
    { $skip: (page - 1) * size },
    { $limit: size },
    { $lookup: {
      from: 'orgs',
      localField: 'orgId',
      foreignField: '_id',
      as: 'org',
    } },
    { $lookup: {
      from: 'roles',
      localField: 'roles',
      foreignField: '_id',
      as: 'roleList',
    } },
    { $project: {
      ...projection,
      org: { $arrayElemAt: ['$org', 0] },
      roleList: 1,
    } },
  ])
    .toArray()
  */

  const total = await col.count(query)
  const list = await col.find(query)
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()
  response.json({
    total,
    list,
  })
})


router.delete('/delete', async (request, response) => {
  const query = filter(request)
  const result = await db.collection('actionLogs').deleteMany(query)
  response.json({
    code: 0,
    message: 'Deleted',
    deletedCount: result.deletedCount,
  })
})


export default router

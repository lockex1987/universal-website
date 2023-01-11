import express from 'express'
import { ObjectId } from 'mongodb'
import db from '#app/helpers/mongodb.mjs'
import { actionList } from '#app/helpers/action-logs.mjs'
import { getAllUsers } from './users.mjs'

const router = express.Router()


const filter = request => {
  const { userId, username, action, ip, createdFrom, createdTo } = request.body

  const query = {}
  if (userId) {
    query.userId = ObjectId(userId)
  }
  if (username) {
    // TODO: lookup collection users
  }
  if (action) {
    query.action = action
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


router.get('/action-list', (request, response) => {
  response.json(actionList)
})


router.get('/get-all-users', getAllUsers)


router.post('/search', async (request, response) => {
  const { page, size } = request.body
  const query = filter(request)
  const col = db.collection('actionLogs')
  const sort = { createdAt: -1 }

  const total = await col.count(query)

  /*
  const list = await col.find(query)
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()
  */

  const list = await col.aggregate([
    { $match: query },
    { $sort: sort },
    { $skip: (page - 1) * size },
    { $limit: size },
    { $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    } },
    /*
    { $project: {
      ...projection,
      org: { $arrayElemAt: ['$org', 0] },
      roleList: 1,
    } },
    */
  ])
    .toArray()

  list.forEach(log => {
    const obj = actionList.find(action => action.id == log.action)
    log.actionName = obj?.name
  })

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

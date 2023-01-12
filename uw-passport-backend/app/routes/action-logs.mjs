import express from 'express'
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import db from '#app/helpers/mongodb.mjs'
import { actionList } from '#app/helpers/action-logs.mjs'
import logger from '#app/helpers/logger.mjs'
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
    // const startOfDay = new Date(dayjs(createdFrom).startOf('day').toISOString())
    const startOfDay = dayjs(createdFrom).startOf('day').toDate()
    logger.debug(startOfDay)
    if (! query.createdAt) {
      query.createdAt = {}
    }
    query.createdAt.$gte = startOfDay
  }
  if (createdTo) {
    // const endOfDay = new Date(dayjs(createdTo).endOf('day').toISOString()) // chạy được, 2023-01-13T16:59:59.999Z
    const endOfDay = dayjs(createdTo).endOf('day').toDate() // cũng chạy được
    logger.debug(endOfDay)
    if (! query.createdAt) {
      query.createdAt = {}
    }
    query.createdAt.$lte = endOfDay
  }
  logger.debug(JSON.stringify(query))
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


router.post('/delete', async (request, response) => {
  const query = filter(request)
  const result = await db.collection('actionLogs').deleteMany(query)
  response.json({
    code: 0,
    message: 'Deleted',
    deletedCount: result.deletedCount,
  })
})


export default router

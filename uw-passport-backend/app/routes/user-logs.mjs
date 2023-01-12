import express from 'express'
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import db from '#app/helpers/mongodb.mjs'
import { actionList } from '#app/helpers/action-logs.mjs'
import { getUser } from '#app/helpers/auth.mjs'

const router = express.Router()


const filter = async request => {
  const redisUser = await getUser(request)

  const { action, ip, createdFrom, createdTo } = request.body

  const query = { userId: ObjectId(redisUser._id) }
  if (action) {
    query.action = action
  }
  if (ip) {
    query.ip = { $regex: ip, $options: 'i' }
  }
  if (createdFrom) {
    const startOfDay = dayjs(createdFrom).startOf('day').toDate()
    if (! query.createdAt) {
      query.createdAt = {}
    }
    query.createdAt.$gte = startOfDay
  }
  if (createdTo) {
    const endOfDay = dayjs(createdTo).endOf('day').toDate()
    if (! query.createdAt) {
      query.createdAt = {}
    }
    query.createdAt.$lte = endOfDay
  }
  return query
}


router.get('/action-list', (request, response) => {
  response.json(actionList)
})


router.post('/search', async (request, response) => {
  const { page, size } = request.body
  const query = await filter(request)
  const col = db.collection('actionLogs')
  const sort = { createdAt: -1 }

  const total = await col.count(query)

  const list = await col.find(query)
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
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


export default router

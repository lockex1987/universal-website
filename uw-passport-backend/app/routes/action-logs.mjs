import express from 'express'
import { ObjectId } from 'mongodb'
import db from '#app/helpers/mongodb.mjs'

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

  const col = db.collection('actionLogs')
  const sort = { _id: -1 }

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
  const { _id } = request.params
  const objId = ObjectId(_id)

  db.collection('users').updateMany(
    { roles: objId },
    { $pull: { roles: objId } },
  )

  const query = { _id: objId }
  const result = await db.collection('actionLogs').deleteMany(query)
  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})


export default router

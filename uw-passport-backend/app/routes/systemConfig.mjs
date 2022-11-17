import express from 'express'
import { getDb } from '#app/helpers/mongodb.mjs'

const router = express.Router()


router.get('/get-all', async (request, response) => {
  const db = getDb()
  const list = await db.collection('systemConfig').find()
    .toArray()
  response.json(list)
})


router.post('/save-config', async (request, response) => {
  const configList = request.body
  const db = getDb()
  for (const config of configList) {
    const query = { _id: config.code }
    const options = { upsert: true }
    const data = {
      _id: config.code,
      code: config.code,
      name: config.name,
      value: config.value,
    }
    await db.collection('systemConfig').replaceOne(query, data, options)
  }
  response.json({
    code: 0,
    message: 'Save success',
  })
})


export default router

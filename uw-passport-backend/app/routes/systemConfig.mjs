import express from 'express'
import { getDb } from '#app/helpers/mongodb.mjs'
import { configList } from '#app/helpers/systemConfig.mjs'

const router = express.Router()

// import { warningThreshold, getConfig } from '#app/helpers/systemConfig.mjs'
// const test = await getConfig(warningThreshold)
// console.log(test)


router.get('/get-all', async (request, response) => {
  const db = getDb()
  const list = await db.collection('systemConfig').find()
    .toArray()
  configList.forEach(config => {
    const temp = list.find(e => e.code == config.code)
    if (temp) {
      config.value = temp.value
    } else {
      config.value = null
    }
  })
  response.json(configList)
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

import express from 'express'
import db from '#app/helpers/mongodb.mjs'
import { configList } from '#app/helpers/system-configs.mjs'

const router = express.Router()

// import { warningThreshold, getConfig } from '#app/helpers/systemConfig.mjs'
// const test = await getConfig(warningThreshold)


router.get('/get-all', async (request, response) => {
  const list = await db.collection('systemConfigs').find()
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
  for (const config of configList) {
    const query = { _id: config.code }
    const options = { upsert: true }
    const data = {
      _id: config.code,
      code: config.code,
      name: config.name,
      value: config.value,
    }
    await db.collection('systemConfigs').replaceOne(query, data, options)
  }
  response.json({
    code: 0,
    message: 'Save success',
  })
})


export default router

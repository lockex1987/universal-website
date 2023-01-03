import { getDb } from '#app/helpers/mongodb.mjs'

export const warningThreshold = 'warningThreshold'

export const configList = [
  {
    code: warningThreshold,
    name: 'Ngưỡng cảnh báo',
    type: 'number',
  },
]

export const getConfig = async code => {
  const db = getDb()
  const query = { _id: code }
  const config = await db.collection('systemConfig').findOne(query)
  if (! config) {
    return null
  }
  return config.value
}

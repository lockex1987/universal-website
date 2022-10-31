import * as app from '#config/app.mjs'
import * as db from '#config/db.mjs'
import * as log from '#config/log.mjs'

const flattenObj = obj => {
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    if ((typeof value) === 'object' && ! Array.isArray(value)) {
      const nestedObj = flattenObj(value)
      for (const nestedKey in nestedObj) {
        result[key + '.' + nestedKey] = nestedObj[nestedKey]
      }
    } else {
      result[key] = value
    }
  }
  return result
}

const addPrefix = (obj, prefix) => {
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    result[prefix + '.' + key] = value
  }
  return result
}

const data = {
  ...addPrefix(flattenObj(app), 'app'),
  ...addPrefix(flattenObj(db), 'db'),
  ...addPrefix(flattenObj(log), 'log'),
}
// console.log(data)

export const config = key => data[key]

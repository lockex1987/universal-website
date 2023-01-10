// Sử dụng mongodb, không sử dụng mongoose, cho giống với khi sử dụng mongosh
import { MongoClient } from 'mongodb'
import { database, uri } from '#config/db.mjs'
import logger from '#app/helpers/logger.mjs'

const client = new MongoClient(uri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})

let db

export const connect = async () => {
  try {
    await client.connect()
    db = client.db(database)
    logger.info('MongoDB connected')

    // Làm thế này thì những chỗ khác không cần import nữa
    globalThis.db = db
  } catch (ex) {
    logger.error(ex)
    process.exit(1)
  }
}

export const close = async () => {
  await client.close()
}

export const getDb = () => db

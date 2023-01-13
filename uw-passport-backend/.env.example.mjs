import 'dotenv/config'

export default {
  CODE: process.env.APP_CODE || 'universal-website',

  PORT: process.env.APP_PORT || 3000,

  LOG_LEVEL: 'info',

  // dev, prod, test
  ENVIRONMENT: process.env.APP_ENV || 'dev',

  ENCRYPTION_KEY: process.env.APP_KEY || '', // node console/commands/generateEncryptionKey.mjs

  // DRIVE_DISK=local

  MONGO: {
    // mongodb://localhost:27017
    // mongodb://uw:abc123a%40@127.0.0.1:27017/?authSource=admin
    URI: process.env.MONGO_URI || 'mongodb://username:password@host:port/?authSource=admin',

    // db.copyDatabase('univeral-website', 'universal-website')
    // use univeral-website
    // db.dropDatabase()

    // `copyDatabase()` was removed because it was deprecated in MongoDB 4.0

    // mongodump -d univeral-website

    // mongorestore -d universal-website dump/univeral-website
    DATABASE: process.env.MONGO_DATABASE || 'universal-website',
  },
}

export default {
  CODE: 'universal-website',

  PORT: 3000,

  LOG_LEVEL: 'info',

  // dev, prod, test
  ENVIRONMENT: 'development',

  // DRIVE_DISK=local

  MONGO: {
    URI: 'mongodb://localhost:27017',

    // db.copyDatabase('univeral-website', 'universal-website')
    // use univeral-website
    // db.dropDatabase()

    // `copyDatabase()` was removed because it was deprecated in MongoDB 4.0

    // mongodump -d univeral-website

    // mongorestore -d universal-website dump/univeral-website
    DATABASE: 'universal-website',
  },
}

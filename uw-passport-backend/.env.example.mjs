export default {
  CODE: 'universal-website',

  PORT: 3000,

  LOG_LEVEL: 'info',

  // development, production, test
  ENVIRONMENT: 'development',

  // DRIVE_DISK=local

  MONGO: {
    URI: 'mongodb://localhost:27017',

    // db.copyDatabase('univeral-website', 'universal-website')
    // use univeral-website
    // db.dropDatabase()
    DATABASE: 'univeral-website',
  },
}

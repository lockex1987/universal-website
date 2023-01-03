import logger from '#app/helpers/logger.mjs'

export default (error, request, response, next) => {
  // Lỗi khi đang response rồi
  if (request.headersSent) {
    return next(error)
  }

  // Lỗi validate
  if (error.type == 'validate') {
    return response.status(422)
      .json({
        code: 1,
        message: 'Validation failed',
        errors: error.errors,
      })
  }

  logger.error(error.stack ?? error)

  response.status(500)
    .send('Something broke!')
}

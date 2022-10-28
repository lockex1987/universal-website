import logger from '#app/helpers/logger.mjs'

// TODO: Khi có lỗi MongoDB đang không vào đây (do là async?)
// Nếu request là async thì cần truyền next(error)
// Từ Express 5 sẽ tự động
export default (error, request, response, next) => {
  // Lỗi khi đang response rồi
  if (request.headersSent) {
    return next(error)
  }

  // Lỗi validate
  if (error.type == 'validate') {
    return response.status(412)
      .json({
        code: 1,
        message: 'Validation failed',
        errors: error.errors,
      })
  }

  // logger.error(error.message)
  // logger.error(error)
  // logger.error(error.stack)
  logger.error(error.stack ?? error)

  response.status(500)
    .send('Something broke!')
}

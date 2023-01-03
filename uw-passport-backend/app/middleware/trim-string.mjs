export default (request, response, next) => {
  if (['POST', 'PUT'].includes(request.method)) {
    if (request.body) {
      // Đang bị lỗi source.hasOwnProperty is not a function
      // do express-fileupload xung đột với async-validator
      if (! request.body.hasOwnProperty) {
        request.body.hasOwnProperty = Object.prototype.hasOwnProperty
      }

      for (const [key, value] of Object.entries(request.body)) {
        if (typeof value === 'string') {
          request.body[key] = value.trim()
        }
      }
    }
  }

  next()
}

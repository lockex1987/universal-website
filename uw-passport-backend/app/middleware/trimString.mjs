export default (request, response, next) => {
  if (['POST', 'PUT'].includes(request.method)) {
    for (const [key, value] of Object.entries(request.body)) {
      if (typeof value === 'string') {
        request.body[key] = value.trim()
      }
    }
  }

  next()
}

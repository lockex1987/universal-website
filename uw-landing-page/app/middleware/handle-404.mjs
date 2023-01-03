export default (request, response, next) => {
  response.status(404)
    .send('Not found')
}

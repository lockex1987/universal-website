// TODO: đang xung đột với checkLogin.mjs
export default (request, response, next) => {
  response.status(404)
    .send('Not found')
}

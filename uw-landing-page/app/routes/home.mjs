export default (request, response) => {
  response.render('index', {
    greeting: 'Hello world 2',
  })
}

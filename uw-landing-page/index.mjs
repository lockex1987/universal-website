import edgeTemplateEngine from '#base/../uw-frontend/app/helpers/edgeTemplateEngine.mjs'

app.engine('edge', edgeTemplateEngine)

app.get('/', (request, response) => {
  response.render('index', {
    greeting: 'Hello world 2',
  })
})

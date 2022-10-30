import express from 'express'
import cookieParser from 'cookie-parser'

import edgeTemplateEngine from '#base/../uw-frontend/app/helpers/edgeTemplateEngine.mjs'

// app.use(express.static('public'))

app.engine('edge', edgeTemplateEngine)
app.set('view engine', 'edge')
app.get('/', (request, response) => {
  response.render('index', {
    greeting: 'Hello world 2',
  })
})

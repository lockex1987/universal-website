// "express@>=5.0.0-beta.1"
// "express": "^4.18.2"

import cors from 'cors'
import express from 'express'

import { connect as connectMongodb } from '#app/helpers/mongodb.mjs'
import redis from '#app/helpers/redis.mjs'
import checkLogin from '#app/middleware/checkLogin.mjs'
import handle404 from '#app/middleware/handle404.mjs'
import handle500 from '#app/middleware/handle500.mjs'
import routes from '#app/routes/index.mjs'
import { port } from '#config/app.mjs'

import '#app/helpers/validator.mjs'

await connectMongodb()
await redis.connect()

const app = express()

app.set('view engine', 'edge')
app.use(express.static('public'))
app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
  response.json({
    code: 0,
    message: 'Hello world',
  })
})

routes.forEach(({ path, router }) => {
  const exceptAuthPaths = [
    '/auth',
  ]
  if (exceptAuthPaths.includes(path)) {
    app.use(path, router)
  } else {
    app.use(path, checkLogin, router)
  }
})

// app.use(checkLogin)
app.use(handle404)
app.use(handle500)

// Disable response header "X-Powered-By"
app.disable('x-powered-by')

app.listen(port, () => {
  console.log('App running at port ' + port)
})

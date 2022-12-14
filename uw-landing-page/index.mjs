import express from 'express'
import cookieParser from 'cookie-parser'

import '#app/helpers/mongodb.mjs'
import '#app/helpers/redis.mjs'
import checkLogin from '#app/middleware/check-login.mjs'
import handle404 from '#app/middleware/handle-404.mjs'
import handle500 from '#app/middleware/handle-500.mjs'
import edgeTemplateEngine from '#app/helpers/edge-template-engine.mjs'
import routes from '#app/routes/index.mjs'
import homeRoute from '#app/routes/home.mjs'
import landingRoute from '#app/routes/landing.mjs'
import dieuKhoanRoute from '#app/routes/dieu-khoan.mjs'
import { port } from '#config/app.mjs'

import '#app/helpers/validator.mjs'
import '#app/helpers/config.mjs'



const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.engine('edge', edgeTemplateEngine)
app.set('view engine', 'edge')

const prefix = '/api'
routes.forEach(({ path, router, auth, permission }) => {
  const middlewares = []
  if (auth) {
    middlewares.push(checkLogin)
  }
  if (permission) {
    // middlewares.push(checkPermission(permission))
  }
  app.use(prefix + path, ...middlewares, router)
})

app.get('/', homeRoute)
app.get('/landing', landingRoute)
app.get('/dieu-khoan', dieuKhoanRoute)

app.use(handle404)
app.use(handle500)

// Disable response header "X-Powered-By"
app.disable('x-powered-by')

app.listen(port, () => {
  console.log('App running at port ' + port)
})

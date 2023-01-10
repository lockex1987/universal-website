import express from 'express'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

import { connect as connectMongodb } from '#app/helpers/mongodb.mjs'
import redis from '#app/helpers/redis.mjs'
import checkLogin from '#app/middleware/check-login.mjs'
import checkPermission from '#app/middleware/check-permission.mjs'
import handle404 from '#app/middleware/handle-404.mjs'
import handle500 from '#app/middleware/handle-500.mjs'
import trimString from '#app/middleware/trim-string.mjs'
import routes from '#app/routes/index.mjs'
import { port } from '#config/app.mjs'

import '#app/helpers/validator.mjs'

await connectMongodb()
// await redis.connect()

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.use(fileUpload({
  limits: {
    // bytes
    // Đang tự động cắt nhưng không thông báo lỗi
    // fileSize: 5 * 1024 * 1024, // 5 MB

    // Returns a HTTP 413 when the file is bigger than the size limit if true.
    // Otherwise, it will add a truncated = true to the resulting file structure.
    abortOnLimit: true,

    // limitHandler: (req, res, next) => res.json({ 'success': false, 'message': 'File size limit has been reached' }),

    limitHandler: (req, res, next) => {
      // res.status(500).end('uploaded file is too large')

      res.writeHead(500, { Connection: 'close' })
      res.end('uploaded file is too large')
    },
  },
}))

app.use(trimString)

const prefix = '/api'
routes.forEach(({ path, router, auth, permission }) => {
  const middlewares = []
  if (auth) {
    middlewares.push(checkLogin)
  }
  if (permission) {
    middlewares.push(checkPermission(permission))
  }
  app.use(prefix + path, ...middlewares, router)
})

app.use(handle404)
app.use(handle500)

// Disable response header 'X-Powered-By'
app.disable('x-powered-by')

app.listen(port, () => {
  console.log('App running at port ' + port)
})

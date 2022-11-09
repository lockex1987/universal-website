import express from 'express'
import { getDb } from '#app/helpers/mongodb.mjs'

const router = express.Router()


router.get('/stats', async (request, response) => {
  const db = getDb()

  const permissions = db.collection('permissions').count({})
  const roles = db.collection('roles').count({})
  const users = db.collection('users').count({})

  response.json({
    permissions,
    roles,
    users,
  })
})


export default router

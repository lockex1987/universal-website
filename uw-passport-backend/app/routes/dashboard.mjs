import express from 'express'
import db from '#app/helpers/mongodb.mjs'

const router = express.Router()


router.get('/stats', async (request, response) => {
  const promises = [
    db.collection('permissions').count({}),
    db.collection('roles').count({}),
    db.collection('users').count({}),
  ]
  const [
    permissions,
    roles,
    users,
  ] = await Promise.all(promises)
  response.json({
    permissions,
    roles,
    users,
  })
})


export default router

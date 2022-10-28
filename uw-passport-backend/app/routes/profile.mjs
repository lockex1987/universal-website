import express from 'express'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { getUser } from '#app/helpers/auth.mjs'

const router = express.Router()

router.post('/change-password', async (request, response) => {
  const rules = {
    oldPassword: 'required|string',
    newPassword: 'required|string',
  }
  await request.validate(request.body, rules)

  const { oldPassword, newPassword } = request.body
  const redisUser = await getUser(request)

  const db = getDb()
  const dbUser = await db.collection('users').findOne({ _id: ObjectId(redisUser.id) })
  if (! dbUser) {
    return response.json({
      code: 1,
      message: 'Not in DB',
    })
  }

  if (! bcrypt.compareSync(oldPassword, dbUser.password)) {
    return response.json({
      code: 1,
      message: 'Old password not matched',
    })
  }

  const rounds = 10
  const hashedPassword = bcrypt.hashSync(newPassword, rounds)
  const query = { _id: ObjectId(redisUser.id) }
  const data = { password: hashedPassword }
  const result = await db.collection('users').updateOne(query, { $set: data })

  response.json({
    code: 0,
    result,
  })
})

export default router

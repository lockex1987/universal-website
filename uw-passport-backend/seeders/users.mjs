import { connect, close, getDb } from '#app/helpers/mongodb.mjs'
import bcrypt from 'bcrypt'

await connect()

const db = getDb()

const username = 'lockex1987'
const plainPassword = '123456aA@'
const rounds = 10
const hashedPassword = bcrypt.hashSync(plainPassword, rounds)
console.log(hashedPassword)
// console.log(bcrypt.compareSync(plainPassword, hashedPassword))
const result = await db.collection('users').insertOne({
  username,
  password: hashedPassword,
})
console.log(result.insertedId)

close()

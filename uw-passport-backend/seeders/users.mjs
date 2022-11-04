import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { connect, close, getDb } from '#app/helpers/mongodb.mjs'

await connect()

const db = getDb()

const insertOne = async () => {
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
}

const insertMany = async () => {
  const userList = []
  for (let i = 0; i < 101; i++) {
    const user = {
      username: faker.internet.userName(),
      fullName: faker.name.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
      thumbnail: faker.image.avatar(),
      password: faker.internet.password(),
    }
    userList.push(user)
  }

  await db.collection('users').insertMany(userList)
}

// await insertOne()
await insertMany()

close()

import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import db, { close } from '#app/helpers/mongodb.mjs'


const insertOne = async () => {
  const username = 'lockex1987'
  const plainPassword = '123456aA@'
  const rounds = 10
  const hashedPassword = bcrypt.hashSync(plainPassword, rounds)
  await db.collection('users').insertOne({
    username,
    password: hashedPassword,
    totp: {
      enabled: false,
      secret: '',
      shouldShow: false,
    },
  })
}


// Cập nhật dữ liệu cũ
// db.users.updateMany({ totp: null }, { $set: { totp: { enabled: false, secret: '', shouldShow: false } } })
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
      totp: {
        enabled: false,
        secret: '',
        shouldShow: false,
      },
    }
    userList.push(user)
  }

  await db.collection('users').insertMany(userList)
}

// await insertOne()
await insertMany()

close()

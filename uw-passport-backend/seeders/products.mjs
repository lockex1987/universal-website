import { connect, close, getDb } from '#app/helpers/mongodb.mjs'
import axios from 'axios'

await connect()

const db = getDb()

const options = {
  proxy: {
    protocol: 'http',
    host: '172.16.2.103',
    port: 9078,
  },
}
const { data } = await axios.get('https://fakestoreapi.com/products', options)
console.log(data)

const productList = data.map(e => ({
  title: e.title,
  description: e.description,
  price: e.price,
  image: e.image,
  category: e.category,
  rating: e.rating,
}))

const result = await db.collection('products').insertMany(productList)
console.log(result.insertedCount)

close()

import db, { close } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'
import axios from 'axios'

const options = {
  proxy: {
    protocol: 'http',
    host: '172.16.2.103',
    port: 9078,
  },
}
const { data } = await axios.get('https://fakestoreapi.com/products', options)
console.log(data)
const productList = data.map(e => pick(e,
  'title',
  'description',
  'price',
  'image',
  'category',
  'rating',
))

const result = await db.collection('products').insertMany(productList)
console.log(result.insertedCount)
close()

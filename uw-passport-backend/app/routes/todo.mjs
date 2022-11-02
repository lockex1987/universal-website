import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'

const router = express.Router()

/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{ "title": "title 1", "description": "description 1" }' \
  http://localhost:3000/todo/create
*/
router.post('/insert', async (request, response) => {
  /*
  const { title, description } = request.body
  const data = {
    title,
    description,
  }
  */
  const data = pick(request.body, 'title', 'description')
  const db = getDb()
  const result = await db.collection('todos').insertOne(data)
  // console.log(result)
  if (result.acknowledged) {
    response.json({
      code: 0,
      message: 'Inserted',
      id: result.insertedId,
    })
  }
})

/*
curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{ "id": "63564e7a6303cac34753d740", "title": "title 1 a", "description": "description 1 b" }' \
  http://localhost:3000/todo/update
*/
router.put('/update', async (request, response) => {
  try {
    const { id, title, description } = request.body
    const query = { _id: ObjectId(id) }
    /*
    const data = {
      title,
      description,
    }
    */
    const data = pick(request.body, 'title', 'description')
    // console.log(id)
    const db = getDb()
    // Chú ý thêm $set
    const result = await db.collection('todos').updateOne(query, { $set: data })
    // console.log(result)
    response.json({
      code: 0,
      message: 'Updated ' + result.modifiedCount,
    })
  } catch (ex) {
    // TODO
    console.log('Khong vao handle500?')
    console.error(ex)
  }
})

/*
curl --request DELETE \
  http://localhost:3000/todo/delete/63564e7a6303cac34753d740
*/
router.delete('/delete/:id', async (request, response) => {
  const { id } = request.params
  // console.log(id)
  const query = { _id: ObjectId(id) }
  const db = getDb()
  const result = await db.collection('todos').deleteOne(query)
  // console.log(result)
  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})

/*
curl http://localhost:3000/todo/get-all
curl "http://localhost:3000/todo/get-all?title=xxx&description=yyy"
*/
router.get('/get-all', async (request, response) => {
  // Đã gán globalThis.db rồi
  // const db = getDb()

  const { title, description } = request.query
  // console.log(title, description)

  const query = {}
  if (title) {
    // query.title = new RegExp(title, 'i')
    query.title = {
      $regex: title,
      $options: 'i',
    }
  }

  // 3 dòng
  /*
  if (description) {
    query.description = new RegExp(description, 'i')
  }
  */

  // 1 dòng
  description && (query.description = new RegExp(description, 'i'))

  const todoList = await db.collection('todos')
    .find(query)
    .skip(0)
    .limit(10)
    .toArray()
  // console.log(todoList)
  response.json({
    code: 0,
    data: todoList,
  })
})

export default router

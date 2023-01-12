import crypto from 'node:crypto'
import express from 'express'
import { ObjectId } from 'mongodb'
import db from '#app/helpers/mongodb.mjs'
import { pick } from '#app/helpers/common.mjs'
import {
  sanitizeHtml,
  htmlToDocument,
  makeSanitizedCopy,
  jsdomBodyToXml,
} from '#app/helpers/html-utils.mjs'

const router = express.Router()


router.post('/search', async (request, response) => {
  const { text, page, size } = request.body

  const query = {}
  if (text) {
    const temp = { $regex: text, $options: 'i' }
    query.$or = [
      { title: temp },
      { description: temp },
    ]
  }

  const col = db.collection('products')
  const total = await col.count(query)
  const projection = {
    // Trường content có dung lượng lớn nên không trả về khi search
    content: 0,
  }
  const sort = { title: 1 }
  const list = await col
    .find(query, { projection })
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
    .toArray()

  response.json({
    total,
    list,
  })
})


router.post('/insert', async (request, response) => {
  const rules = {
    title: [
      { required: true, max: 200 },
      { type: 'unique', dbCol: 'products', fullField: 'Tên' },
    ],
    description: [{ required: true, max: 500 }],
    content: [{ required: true }], // , max: 5000
    image: [{ type: 'url', required: true, max: 500 }],
    price: [{ type: 'number', required: true, max: 1_000_000_000, min: 0 }],
  }
  await request.validate(rules)

  const data = processData(request)
  const result = await db.collection('products').insertOne(data)
  response.json({
    code: 0,
    message: 'Inserted ' + result.insertedId,
  })
})


router.put('/update', async (request, response) => {
  const { _id } = request.body
  const objId = ObjectId(_id)
  const rules = {
    title: [
      { required: true, max: 200 },
      { type: 'unique', dbCol: 'products', fullField: 'Tên', ignoredIdValue: objId },
    ],
    description: [{ required: true, max: 500 }],
    content: [{ required: true }], // , max: 5000
    image: [{ type: 'url', required: true, max: 500 }],
    price: [{ type: 'number', required: true, max: 1_000_000_000, min: 0 }],
  }
  await request.validate(rules)

  const query = { _id: objId }
  const data = processData(request)
  const result = await db.collection('products').updateOne(query, { $set: data })
  response.json({
    code: 0,
    message: 'Updated ' + result.modifiedCount,
  })
})


router.delete('/delete/:_id', async (request, response) => {
  const { _id } = request.params
  const objId = ObjectId(_id)
  const query = { _id: objId }
  const result = await db.collection('products').deleteOne(query)
  response.json({
    code: 0,
    message: 'Deleted ' + result.deletedCount,
  })
})


router.get('/content/:_id', async (request, response) => {
  const { _id } = request.params
  const objId = ObjectId(_id)
  const query = { _id: objId }
  const row = await db.collection('products').findOne(query)
  response.json(row)
})


const processData = request => {
  const data = pick(request.body,
    'title',
    'description',
    'price',
    'image',
  )

  // data.content = sanitizeHtml(request.body.content)

  const html = '<body>' + request.body.content + '</body>'
  const document = htmlToDocument(html)
  const sanitizedBody = makeSanitizedCopy(document, document.body)
  saveBase64Image(sanitizedBody)
  const xml = jsdomBodyToXml(sanitizedBody)
  data.content = xml

  return data
}


const saveBase64Image = document => {
  const imgList = document.querySelectorAll('img')
  imgList.forEach(img => {
    const src = img.src
    if (src.includes(';')) {
      const [, base64] = src.split(';')
      const [, data] = base64.split(',')
      const extension = data.startsWith('/9j') ? 'jpg' : 'png'
      console.log(extension)

      // const imagesFolder = getImagesFolder(contentId)
      // const imagePath = imagesFolder + '/' + generateRandomName() + '.' + extension
      // Storage::makeDirectory(imagesFolder)

      // file_put_contents(storage_path('app/public/' . $imagePath), base64_decode($data));
      // Storage::put($imagePath, base64_decode($data));

      // img.src = '/storage/' + imagePath
    }
  })
}


const generateRandomName = () => {
  const uuid = crypto.randomUUID() // có 36 ký tự
  const bytesNum = 10
  const random = crypto.randomBytes(bytesNum).toString('hex') // có bytesNum * 2 = 20 ký tự
  return uuid + random
}


export default router

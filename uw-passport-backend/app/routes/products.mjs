import crypto from 'node:crypto'
import fs from 'node:fs'
import express from 'express'
import { ObjectId } from 'mongodb'
import db from '#app/helpers/mongodb.mjs'
import { pick, getBasePath } from '#app/helpers/common.mjs'
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
  const _id = result.insertedId
  const content = processHtml(request, _id)
  await db.collection('products').updateOne({ _id }, { $set: { content } })
  response.json({ code: 0 })
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
  data.content = processHtml(request, _id)
  await db.collection('products').updateOne(query, { $set: data })
  response.json({ code: 0 })
})


router.delete('/delete/:_id', async (request, response) => {
  const { _id } = request.params

  const basePath = getBasePath()
  const uploadFolder = getUploadFolder(_id)
  fs.rmdirSync(basePath + uploadFolder, { recursive: true })

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
  return data
}


const processHtml = (request, productId) => {
  // data.content = sanitizeHtml(request.body.content)

  const html = '<body>' + request.body.content + '</body>'
  const document = htmlToDocument(html)
  const sanitizedBody = makeSanitizedCopy(document, document.body)
  saveBase64Image(sanitizedBody, productId)
  const xml = jsdomBodyToXml(sanitizedBody)
  return xml
}


const saveBase64Image = (document, productId) => {
  const basePath = getBasePath()
  const imgList = document.querySelectorAll('img')
  imgList.forEach(img => {
    const src = img.src
    if (src.includes(';')) {
      const [, base64] = src.split(';')
      const [, data] = base64.split(',')
      const extension = data.startsWith('/9j') ? 'jpg' : 'png'

      const uploadFolder = getUploadFolder(productId)
      if (! fs.existsSync(basePath + uploadFolder)) {
        fs.mkdirSync(basePath + uploadFolder, { recursive: true })
      }

      const imagePath = uploadFolder + '/' + generateRandomName() + '.' + extension
      fs.writeFileSync(basePath + imagePath, data, 'base64')

      img.src = '/' + imagePath
    }
  })
}


const generateRandomName = () => {
  const uuid = crypto.randomUUID() // có 36 ký tự
  const bytesNum = 10
  const random = crypto.randomBytes(bytesNum).toString('hex') // có bytesNum * 2 = 20 ký tự
  return uuid + random
}


const getUploadFolder = productId => {
  return 'upload/products/' + productId
}


export default router

import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { getBasePath } from '#app/helpers/common.mjs'
import logger from '#app/helpers/logger.mjs'

const router = express.Router()

const basePath = getBasePath()
const folder = basePath + 'logs'

const checkPathTraversal = (inputPath, folder) => {
  const absolutePath = path.resolve(inputPath)
  if (! absolutePath.startsWith(folder)) {
    throw new Error('Invalid path')
  }
}


router.get('/file-list', (request, response) => {
  const arr = fs.readdirSync(folder)
  const HIDDEN = [
    // '.',
    // '..',
    '.gitignore',
  ]
  const fileList = arr.filter(fileName => ! HIDDEN.includes(fileName))
    .map(fileName => {
      const path = folder + '/' + fileName
      const stat = fs.statSync(path)
      const size = stat.size
      return {
        fileName,
        size,
      }
    })
  response.json(fileList)
})


router.get('/download-file', (request, response) => {
  const { fileName } = request.query
  const path = folder + '/' + fileName
  checkPathTraversal(path, folder)
  response.download(path)
})


router.post('/clear-file', (request, response) => {
  const { fileName } = request.body
  const path = folder + '/' + fileName
  checkPathTraversal(path, folder)
  // logger.debug(path)
  fs.writeFileSync(path, '')
  response.json({ code: 0 })
})


router.post('/delete-file', (request, response) => {
  const { fileName } = request.body
  const path = folder + '/' + fileName
  checkPathTraversal(path, folder)
  fs.unlinkSync(path)
  response.json({ code: 0 })
})


export default router

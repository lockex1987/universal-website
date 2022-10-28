import fs from 'fs'
import { Edge } from 'edge.js'

let manifest = null
const caches = {}
const edge = new Edge({ cache: process.env.NODE_ENV === 'production' })

edge.global('vite', x => {
  if (manifest == null) {
    const path = './public/build/manifest.json'
    const content = fs.readFileSync(path, 'utf-8')
    manifest = JSON.parse(content)
  }

  const obj = manifest[x]

  if (!obj) {
    return 'Not found'
  }

  const outDir = '/build'
  let fragment = ''
  if (obj.css && obj.css.length) {
    obj.css.forEach(cssLink => {
      fragment += `<link rel="stylesheet" href="${outDir}/${cssLink}" />`
    })
  }
  fragment += `<script type="module" src="${outDir}/${obj.file}"></script>`
  return fragment
})

const edgeTemplateEngine = (filePath, options, callback) => {
  let content = caches[filePath]
  if (!content) {
    content = fs.readFileSync(filePath, 'utf-8')
    caches[filePath] = content
  }
  const rendered = edge.renderRawSync(content, options)
  return callback(null, rendered)
}

export default edgeTemplateEngine

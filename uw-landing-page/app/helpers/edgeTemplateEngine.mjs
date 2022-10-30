import fs from 'fs'
import { Edge } from 'edge.js'
import { environment } from '#config/app.mjs'
import { getBasePath } from '#app/helpers/common.mjs'

let manifest = null
const caches = {}
const shouldCache = environment === 'prod'
const edge = new Edge({ cache: shouldCache })
const rootUrl = 'http://localhost:5173/'
const outDir = '/build'

// Làm thế này mới extends layout được
edge.mount(getBasePath() + 'views')

const initManifest = () => {
  if (manifest == null) {
    const path = getBasePath() + 'public/build/manifest.json'
    const content = fs.readFileSync(path, 'utf-8')
    manifest = JSON.parse(content)
  }
}

const vite = (path, includeViteClient = true) => {
  if (environment == 'dev') {
    return (includeViteClient ? `<script type="module" src="${rootUrl}@vite/client"></script>` : '')
      + `<script type="module" src="${rootUrl}${path}"></script>`
  }

  initManifest()

  const obj = manifest[path]
  if (! obj) {
    return 'Not found'
  }

  let fragment = ''
  if (obj.css && obj.css.length) {
    obj.css.forEach(cssLink => {
      fragment += `<link rel="stylesheet" href="${outDir}/${cssLink}" />`
    })
  }
  fragment += `<script type="module" src="${outDir}/${obj.file}"></script>`
  return fragment
}

const scss = path => {
  if (environment == 'dev') {
    return `<link rel="stylesheet" href="${rootUrl}${path}" />`
  }

  initManifest()

  const obj = manifest[path]
  if (! obj) {
    return 'Not found'
  }

  return `<link rel="stylesheet" href="${outDir}/${obj.file}" />`
}

edge.global('vite', vite)
// TODO
edge.global('scss', scss)
edge.global('config', x => x)

const edgeTemplateEngine = (filePath, options, callback) => {
  let content = caches[filePath]
  if (! content) {
    content = fs.readFileSync(filePath, 'utf-8')
    if (shouldCache) {
      caches[filePath] = content
    }
  }
  const rendered = edge.renderRawSync(content, options)
  return callback(null, rendered)
}

export default edgeTemplateEngine

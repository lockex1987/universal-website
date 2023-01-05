import { request } from 'express'
import path from 'node:path'
import asyncValidator from 'async-validator'
import { ObjectId } from 'mongodb'
import { getDb } from '#app/helpers/mongodb.mjs'
import vietnameseValidatorMessages from './vietnamese-validator-messages.mjs'

const Schema = asyncValidator.default

const strongPassword = (rule, value, callback, source, options) => {
  if (! value) {
    return true
  }

  const errors = []
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/
  if (! strongPasswordRegex.test(value)) {
    errors.push('Mật khẩu phải chứa chữ hoa, chữ thường, số')
  }
  callback(errors)
}

const telephone = (rule, value, callback, source, options) => {
  if (! value) {
    return true
  }

  const errors = []
  const telephoneRegex = /^\d{3}-\d{3}-\d{4}$/
  if (! telephoneRegex.test(value)) {
    errors.push('Không đúng định dạng số điện thoại XXX-XXX-XXXX')
  }
  callback(errors)
}

const unique = async (rule, value, callback, source, options) => {
  if (! value) {
    return true
  }

  // console.log(rule)
  // console.log(value)
  // console.log(source)
  // console.log(options)

  const field = rule.dbField || rule.field
  const col = rule.dbCol
  const ignoredIdValue = rule.ignoredIdValue
  const idField = rule.idField ?? '_id'

  const errors = []
  const db = getDb()
  const query = {
    [field]: {
      $regex: '^' + value + '$',
      $options: 'i',
    },
  }
  if (ignoredIdValue) {
    query[idField] = { $ne: ignoredIdValue }
  }
  const count = await db.collection(col).count(query)
  if (count > 0) {
    // console.log(options.messages)
    errors.push((rule.dbFieldName ?? rule.field) + vietnameseValidatorMessages.unique) // options.messages.unique
  }
  callback(errors)
}

const exist = async (rule, value, callback, source, options) => {
  if (! value) {
    return true
  }

  const col = rule.dbCol
  const errors = []
  const db = getDb()
  const query = { _id: ObjectId(value) }
  const count = await db.collection(col).count(query)
  if (count == 0) {
    // console.log(options)
    errors.push((rule.dbFieldName ?? rule.field) + vietnameseValidatorMessages.exist) // options.messages.exist
  }
  callback(errors)
}

const upload = (rule, value, callback, source, options) => {
  const { request } = rule
  const file = request.files?.[rule.field]
  if (! file) {
    return true
  }

  const errors = []
  const maxFileSize = rule.maxFileSize
  const allowedExtensions = rule.extensions

  if (file.size > maxFileSize * 1024 * 1024) {
    errors.push('Dung lượng file quá lớn, tối đa ' + maxFileSize + ' MB')
  }

  const extension = path.extname(file.name)
    .substring(1)
    .toLowerCase()
  if (! allowedExtensions.includes(extension)) {
    errors.push('Chỉ được upload các file với định dạng ' + allowedExtensions.join(', '))
  }

  callback(errors)
}

const setupValidator = () => {
  // Thêm phương thức cho request
  request.validate = async function (rules) {
    try {
      const data = this.body // request.body
      const validator = new Schema(rules)
      validator.messages(vietnameseValidatorMessages)
      await validator.validate(data)
    } catch ({ errors, fields }) {
      const error = new Error('validate')
      // Custom prop to specify handling behaviour
      error.type = 'validate'
      error.errors = errors
      throw error
    }
  }

  // Thêm các luật
  Schema.register('strongPassword', strongPassword)
  Schema.register('telephone', telephone)
  Schema.register('unique', unique)
  Schema.register('exist', exist)
  Schema.register('upload', upload)
}

setupValidator()

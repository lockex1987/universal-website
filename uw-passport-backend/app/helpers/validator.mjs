import { request } from 'express'
import path from 'node:path'
import asyncValidator from 'async-validator'
import { getDb } from '#app/helpers/mongodb.mjs'
import vietnameseValidatorMessages from './vietnameseValidatorMessages.mjs'

const strongPassword = (rule, value, callback, source, options) => {
  const errors = []
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/
  if (! strongPasswordRegex.test(value)) {
    errors.push('Mật khẩu phải chứa chữ hoa, chữ thường, số')
  }
  callback(errors)
}

const telephone = (rule, value, callback, source, options) => {
  const errors = []
  const telephoneRegex = /^\d{3}-\d{3}-\d{4}$/
  if (! telephoneRegex.test(value)) {
    errors.push('Không đúng định dạng số điện thoại XXX-XXX-XXXX')
  }
  callback(errors)
}

const unique = async (rule, value, callback, source, options) => {
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
    errors.push(rule.dbFieldName + options.messages.unique)
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
  const Schema = asyncValidator.default

  // Tiếng Việt
  Schema.messages = vietnameseValidatorMessages

  // TODO: tên attribute chưa có tiếng Việt
  // để message là chung chung

  // Thêm phương thức cho request
  // https://github.com/mikeerickson/validatorjs/issues/418
  request.validate = async (body, rules) => {
    try {
      const validator = new Schema(rules)
      await validator.validate(body)
    } catch (ex) {
      console.error(ex)
      const { errors, fields } = ex
      console.log(errors)
      console.log(fields)
      const error = new Error('validate')
      // Custom prop to specify handling behaviour
      error.type = 'validate'
      error.errors = errors
      throw error
    }
  }

  Schema.register('strongPassword', strongPassword)
  Schema.register('telephone', telephone)
  Schema.register('unique', unique)
  Schema.register('upload', upload)
}

setupValidator()

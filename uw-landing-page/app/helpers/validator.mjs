import { request } from 'express'
import Validator from 'validatorjs'
import { getDb } from '#app/helpers/mongodb.mjs'

const addValidator = () => {
  // Tiếng Việt
  Validator.useLang('vi')

  // TODO: tên attribute chưa có tiếng Việt

  // Thêm phương thức cho request
  // https://github.com/mikeerickson/validatorjs/issues/418
  request.validate = async (body, rules) => {
    const validator = new Validator(body, rules)

    let passes = () => {}
    let fails = () => {}

    const promise = new Promise(resolve => {
      passes = () => { resolve(true) }
      fails = () => { resolve(false) }
    })

    validator.checkAsync(passes, fails)
    const result = await promise
    if (result === false) {
      const error = new Error('validate')
      // custom prop to specify handling behaviour
      error.type = 'validate'
      error.errors = validator.errors.errors
      throw error
    }
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/
  Validator.register(
    'strongPassword',
    (value, requirement, attribute) => {
      return strongPasswordRegex.test(value)
    },
    'Mật khẩu phải chứa chữ hoa, chữ thường, số',
  )

  Validator.register(
    'telephone',
    (value, requirement, attribute) => {
      return value.match(/^\d{3}-\d{3}-\d{4}$/)
    },
    'Trường :attribute không đúng định dạng số điện thoại XXX-XXX-XXXX',
  )

  // Checks if incoming value already exist for unique and non-unique fields in the database
  // e.g email: required|email|unique:users,email
  Validator.registerAsync('unique', async (value, attribute, messageOrRequest, passes) => {
    if (! attribute) {
      throw new Error('Specify Requirements i.e fieldName: unique:collection,field')
    }
    const attArr = attribute.split(',')
    if (attArr.length < 2) {
      throw new Error(`Invalid format for validation rule on ${attribute}`)
    }
    const [col, field] = attArr
    const id = attArr.length == 3 ? attArr[2] : null

    const db = getDb()
    const query = {
      [field]: value,
    }
    if (id) {
      // TODO: cập nhật
    }
    const count = await db.collection(col).count(query)
    // console.log(count)

    if (count > 0) {
      const errorMessage = `Trường :attribute ${field} đã tồn tại`
      passes(false, errorMessage)
      return
    }
    passes()
  })
}

addValidator()

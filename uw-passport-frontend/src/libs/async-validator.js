import Schema from 'async-validator'
import vietnameseValidatorMessages from '@/helpers/vietnamese-validator-messages.mjs'

const upload = (rule, fileList, callback, source, options) => {
  const temp = fileList.length ? fileList[fileList.length - 1] : null
  if (! temp) {
    return true
  }

  const file = temp.originFileObj
  const errors = []
  const maxFileSize = rule.maxFileSize
  const allowedExtensions = rule.extensions

  if (file.size > maxFileSize * 1024 * 1024) {
    errors.push('Dung lượng file quá lớn, tối đa ' + maxFileSize + ' MB')
  }

  const extension = file.name.split('.').pop().toLowerCase()
  if (! allowedExtensions.includes(extension)) {
    errors.push('Chỉ được upload các file với định dạng ' + allowedExtensions.join(', '))
  }

  callback(errors)
}

Schema.register('upload', upload)

// TODO: Có chạy được không?
// console.log(asyncValidator)
// console.log(vietnameseValidatorMessages)
// const Schema = asyncValidator.default
// Schema.messages = vietnameseValidatorMessages
Schema.messages = vietnameseValidatorMessages

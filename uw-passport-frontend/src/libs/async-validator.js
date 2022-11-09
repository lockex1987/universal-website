import asyncValidator from 'async-validator'

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

asyncValidator.register('upload', upload)

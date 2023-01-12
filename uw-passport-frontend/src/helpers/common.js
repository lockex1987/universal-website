import dayjs from 'dayjs'


/**
 * Hiển thị số có ngăn cách hàng nghìn.
 * @param {number|null} num Số
 * @return {string}
 */
export const formatNumber = num => {
  if (! num) {
    return ''
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


/**
 * Hiển thị làm tròn số.
 * @param {number} num
 * @param {number|undefined} digits Số chữ số sau dấu phảy
 */
export const prettyNumber = (num, digits) => {
  if (digits === undefined) {
    digits = 1
  }

  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'K' },
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      const n = (num / si[i].value).toFixed(digits)

      // Xóa những chữ số 0 đằng sau dấu thập phân
      // Nếu chỉ để 0+ thì sẽ không xóa được dấu .
      // Nếu chỉ để \.0+ thì sẽ không xử lý được trường hợp 123.400
      return n.replace(/\.?0+$/, '') + si[i].symbol
    }
  }
  return num
}


export const formatDate = text => {
  if (! text) {
    return ''
  }

  return dayjs(text).format('DD/MM/YYYY')
}


export const formatDateTime = text => {
  if (! text) {
    return ''
  }

  return dayjs(text).format('DD/MM/YYYY HH:mm:ss')
}


/**
 * Không thực hiện hàm luôn khi người dùng đang thao tác,
 * mà chờ sau khi người dùng đã thực hiện xong một khoảng thời gian nào đó.
 * @param {Function} fn Hàm nghiệp vụ
 * @param {number} ms Millisecond
 */
export const debounce = (fn, ms) => {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, ms)
  }
}


/**
 * Download dữ liệu Blob.
 * @param {Blob} blob
 * @param {string} fileName
 */
export const downloadBlob = (blob, fileName) => {
  const link = window.URL.createObjectURL(blob)

  // Tạo một thẻ a tạm và giả lập thao tác click vào thẻ đó
  const a = document.createElement('a')
  a.download = fileName
  a.innerHTML = 'Download file'
  a.href = link
  a.style.display = 'none'
  a.onclick = evt => {
    // Remove the a tag
    document.body.removeChild(evt.target)
  }

  // Gắn nó vào DOM và thực hiện thao tác click
  document.body.appendChild(a)
  a.click()

  window.URL.revokeObjectURL(link)
}


/**
 * Hàm save as do mình tự làm.
 * @param {string} text Nội dung của văn bản cần lưu
 * @param {string} fileName Tên file
 */
export const saveTextAsFile = (text, fileName) => {
  const textFileAsBlob = new Blob([text], { type: 'text/plain' })
  downloadBlob(textFileAsBlob, fileName)
}


/**
 * Mặc định tìm kiếm theo value, giờ chuyển sang tìm kiếm theo label.
 * @param {string} input Xâu đang search
 * @param {Object} option Từng phần tử
 */
export const filterSelectByLabel = (input, option) => {
  // console.log(option)
  const temp = input.toLowerCase()
  return option.label.toLowerCase().includes(temp)
}

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
  // Tạo đối tượng Blob
  const textFileAsBlob = new Blob([text], { type: 'text/plain' })

  downloadBlob(textFileAsBlob, fileName)
}

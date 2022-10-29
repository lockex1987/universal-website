const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const toCurrency = value => formatter.format(value)

/**
 * Hiển thị số có ngăn cách hàng nghìn.
 * @param {number|null} num Số
 * @retrn {string}
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

import { fileURLToPath, URL } from 'url'


export const pick = (obj, ...props) => {
  if (! obj || ! props) {
    return null
  }

  const picked = {}
  props.forEach(prop => {
    picked[prop] = obj[prop]
  })
  return picked
}


/**
 * Có ký tự / ở cuối.
 * @return {string}
 */
export const getBasePath = () => {
  return fileURLToPath(new URL('../..', import.meta.url))
}


/**
 * Lấy địa chỉ IP. Có thể qua load-balancer.
 * @param {Request} request
 * @returns {string}
 */
export const getIp = request => {
  // request.headers đã đảm bảo các header name ở dạng chữ thường rồi
  const ip = request.headers['x-forwarded-for']?.toString() || request.socket.remoteAddress
  return ip.replace('::ffff:', '')
}

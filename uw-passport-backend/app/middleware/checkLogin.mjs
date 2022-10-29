import { getUser } from '#app/helpers/auth.mjs'

/**
 * Danh sách các đường dẫn không kiểm tra.
 * Có ký tự / ở đầu.
 */
const exceptPaths = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  '/',
]

export default async (request, response, next) => {
  console.log('Phải để trước các khai báo route khác?')
  // TODO: Cần bỏ qua file tĩnh (ảnh, JS, CSS)
  // TODO: Không tìm thấy 404 cũng vào đây
  // TODO: Đang xung đột với handle404
  // Sao sso-admin bằng Laravel vẫn chạy được?
  const path = request.path

  if (exceptPaths.includes(path)) {
    return next()
  }

  const redisUser = await getUser(request)
  if (! redisUser) {
    console.log(path)
    return response.status(401)
      .json({ error: 'Must be logged in' })
  }

  // TODO: Tăng TTL của token, dựa vào trường expiredTime trong Redis

  next()
}

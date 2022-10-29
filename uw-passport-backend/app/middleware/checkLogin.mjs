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
  const path = request.path

  if (exceptPaths.includes(path)) {
    return next()
  }

  const redisUser = await getUser(request)
  if (! redisUser) {
    console.log(path)

    response.clearCookie('sessionId')

    return response.status(401)
      .json({ error: 'Must be logged in' })
  }

  // TODO: Tăng TTL của token, dựa vào trường expiredTime trong Redis

  next()
}


import {
  getSessionId,
  getUser,
  updateExpiredTime,
  setCookie,
  clearCookie,
} from '#app/helpers/auth.mjs'

/**
 * Danh sách các đường dẫn không kiểm tra.
 * Có ký tự / ở đầu.
 */
const exceptPaths = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
]

export default async (request, response, next) => {
  const path = request.path

  if (exceptPaths.includes(path)) {
    return next()
  }

  const redisUser = await getUser(request)
  if (! redisUser) {
    clearCookie(response)
    return response.status(401)
      .json({ error: 'Must be logged in' })
  }

  const sessionId = getSessionId(request)
  const expiredTimeInSeconds = redisUser.expiredTime
  updateExpiredTime(sessionId, expiredTimeInSeconds)
  setCookie(response, sessionId, expiredTimeInSeconds)

  next()
}

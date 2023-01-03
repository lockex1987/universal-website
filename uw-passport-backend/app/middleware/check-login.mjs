
import {
  getSessionId,
  getUser,
  updateExpiredTime,
  setCookie,
  clearCookie,
} from '#app/helpers/auth.mjs'

export default async (request, response, next) => {
  const redisUser = await getUser(request)
  if (! redisUser) {
    clearCookie(response)
    return response.status(401)
      .json({ error: 'Must be logged in' })
  }

  const sessionId = getSessionId(request)
  const expiredTimeInSeconds = redisUser.expiredTime
  updateExpiredTime(sessionId, expiredTimeInSeconds, request)
  setCookie(response, sessionId, expiredTimeInSeconds)

  next()
}

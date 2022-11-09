
import { getUser } from '#app/helpers/auth.mjs'

export default permission => {
  return async (request, response, next) => {
    const redisUser = await getUser(request)
    if (! redisUser.permissions.includes(permission)) {
      return response.status(403)
        .json({ error: 'Permission denied' })
    }
    next()
  }
}

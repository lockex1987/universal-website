
import { getUser } from '#app/helpers/auth.mjs'

export default permission => {
  return async (request, response, next) => {
    const redisUser = await getUser(request)
    const hasPermission = redisUser.permissions.includes(permission)
    if (! hasPermission) {
      return response.status(403)
        .json({ error: 'Permission denied' })
    }
    next()
  }
}

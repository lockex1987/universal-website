
import { getUser } from '#app/helpers/auth.mjs'

export default permission => {
  return async (request, response, next) => {
    console.log(permission)
    const redisUser = await getUser(request)
    if (! redisUser) {
      return response.status(403)
        .json({ error: 'Permission denied' })
    }
    next()
  }
}

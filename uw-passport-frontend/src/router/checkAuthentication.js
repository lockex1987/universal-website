import { user, beforeLoginPath } from '@/stores/auth'
// import { getToken, deleteToken } from '@/helpers/sso'
import axios from 'axios'

export default async to => {
  const path = to.path

  // const token = getToken()

  if (!user.id) {
    const { data } = await axios.get('/me')
    if (data.code == 0) {
      user.value = data.user
    } else {
      // deleteToken()
    }
  }

  if (!user.id) {
    const isLoginOnlyPage = path.startsWith('/backend')
    if (path == '/' || isLoginOnlyPage) {
      beforeLoginPath.value = to.fullPath
      return { name: 'login' }
    }
  } else {
    if (path == '/login'
      || path == '/') {
      return { name: 'dashboard' }
    }
  }
}

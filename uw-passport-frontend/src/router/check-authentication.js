import { isLoggedIn, setLogin, beforeLoginPath } from '@/stores/auth.js'

export default async to => {
  if (! isLoggedIn.value) {
    const { data } = await axios.get('/api/auth/me')
    if (data.code == 0) {
      setLogin(data.user)
    }
  }

  const path = to.path
  if (! isLoggedIn.value) {
    const isLoginOnlyPage = path.startsWith('/backend')
    if (path == '/' || isLoginOnlyPage) {
      beforeLoginPath.value = to.fullPath
      return { name: 'Login' }
    }
  } else {
    if (path == '/' || path == '/login') {
      return { name: 'Dashboard' }
    }
  }
}

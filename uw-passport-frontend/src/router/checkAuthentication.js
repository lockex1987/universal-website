import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'

export default async to => {
  const path = to.path

  const authStore = useAuthStore()

  if (!authStore.user.id) {
    const { data } = await axios.get('/api/auth/me')
    if (data.code == 0) {
      authStore.user = data.user
    }
  }

  if (!authStore.user.id) {
    const isLoginOnlyPage = path.startsWith('/Backend')
    if (path == '/' || isLoginOnlyPage) {
      authStore.beforeLoginPath = to.fullPath
      return { name: 'Login' }
    }
  } else {
    if (path == '/' || path == '/Login') {
      return { name: 'Profile' }
    }
  }
}

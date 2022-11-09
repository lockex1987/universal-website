import { useAuthStore } from '@/stores/auth.js'

export default async to => {
  const authStore = useAuthStore()

  const needPermission = to.meta?.permission
  if (needPermission) {
    const hasPermission = (authStore.user.permissions ?? []).includes(needPermission)
    if (! hasPermission) {
      return { name: 'NoPermission' }
    }
  }
}

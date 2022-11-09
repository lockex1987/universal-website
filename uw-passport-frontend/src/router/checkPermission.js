import { useAuthStore } from '@/stores/auth.js'

export default async to => {
  const authStore = useAuthStore()

  const needPermission = to.meta?.permission
  if (needPermission) {
    if (! (authStore.user.permissions ?? []).includes(needPermission)) {
      return { name: 'NoPermission' }
    }
  }
}

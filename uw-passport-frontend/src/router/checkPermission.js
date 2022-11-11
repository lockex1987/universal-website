import { loginUser } from '@/stores/auth.js'

export default async to => {
  const needPermission = to.meta?.permission
  if (needPermission) {
    const userPermissions = loginUser.permissions
    const hasPermission = userPermissions.includes(needPermission)
    if (! hasPermission) {
      return { name: 'NoPermission' }
    }
  }
}

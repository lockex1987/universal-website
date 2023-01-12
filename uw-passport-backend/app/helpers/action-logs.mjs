import { ObjectId } from 'mongodb'
import db from '#app/helpers/mongodb.mjs'
import { getIp } from '#app/helpers/common.mjs'
import { getUser } from '#app/helpers/auth.mjs'

// Các loại hành động
export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const INSERT_ROLE = 'insert_role'
export const UPDATE_ROLE = 'update_role'
export const DELETE_ROLE = 'delete_role'

export const actionList = [
  { id: LOGIN, name: 'Đăng nhập' },
  { id: LOGOUT, name: 'Đăng xuất' },
  { id: INSERT_ROLE, name: 'Thêm mới vai trò' },
  { id: UPDATE_ROLE, name: 'Cập nhật vai trò' },
  { id: DELETE_ROLE, name: 'Xóa vai trò' },
]

export const insertLog = async (request, action, description, userId) => {
  // Khi đăng nhập thì không có thông tin token ở header của request,
  // nên không thể lấy người dùng từ Redis
  if (! userId) {
    const redisUser = await getUser(request)
    userId = ObjectId(redisUser._id)
  }

  const data = {
    ip: getIp(request),
    action,
    description,
    createdAt: new Date(),
    userId,
  }
  await db.collection('actionLogs').insertOne(data)
}

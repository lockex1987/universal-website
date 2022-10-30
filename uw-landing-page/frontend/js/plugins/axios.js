import { getToken, deleteToken } from '~/helpers/sso.js'

// Request interceptor
axios.interceptors.request.use(request => {
  const token = getToken()
  if (token) {
    request.headers.common.Authorization = `Bearer ${token}`
  }
  return request
})

// Response interceptor
axios.interceptors.response.use(
  // Khi thành công thì trả về response luôn
  response => response,

  // Khi có lỗi thì xử lý lỗi chung
  error => {
    const { status } = error.response

    if (status >= 500) {
      noti.error('Đã có lỗi xảy ra')
    }

    if (status == 403) {
      noti.error('Bạn không có quyền thực hiện chức năng này')
    }

    // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    // Session đã hết hạn, CSRF token không hợp lệ, chưa đăng nhập
    // Token không hợp lệ, hết hạn
    // Chưa được phân quyền
    if ([440, 419, 401].includes(status)) {
      // Xóa token cũ đã hết hạn
      deleteToken()

      // Về trang chủ
      window.location = '/'
    }

    // Xử lý lỗi validate do Laravel trả về
    if (status == 422) {
      const errors = error.response.data.errors
      let message = ''
      for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
          const arr = errors[key]
          arr.forEach(s => {
            message += s + '\n'
          })
        }
      }
      noti.error(message.trim())
    }

    // return Promise.reject(error);
    return Promise.resolve({
      data: {
        code: status,
      },
    })
  },
)

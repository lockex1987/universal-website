import axios from 'axios'

// axios.defaults.baseURL = window.ROOT_API
// axios.defaults.withCredentials = true


// Response interceptor
axios.interceptors.response.use(
  // Khi thành công thì trả về response luôn
  response => response,

  // Khi có lỗi thì xử lý lỗi chung
  error => {
    const { status } = error.response

    if (status >= 500) {
      // noti.error('Đã có lỗi xảy ra')
    }

    if (status == 403) {
      // noti.error('Bạn không có quyền thực hiện chức năng này')
    }

    // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    // Session đã hết hạn, CSRF token không hợp lệ, chưa đăng nhập
    // Token không hợp lệ, hết hạn
    // Chưa được phân quyền
    if ([440, 419, 401].includes(status)) {
      // Xóa CSRF token cũ đã hết hiệu lực
      // deleteToken()

      // Về trang chủ
      window.location = '/'
    }

    // Xử lý lỗi validate do Laravel trả về
    if (status == 422) {
      const errors = error.response.data.errors
      let message = ''
      for (const key in errors) {
        const arr = errors[key]
        arr.forEach(s => {
          message += s + '<br />'
        })
      }
      // noti.error(message.trim())
      alert(message.trim())
    }

    // return Promise.reject(error)
    return Promise.resolve({ data: { code: status } })
  },
)

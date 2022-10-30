import { getToken, deleteToken } from '~/helpers/sso.js'

Vue.createApp({
  data() {
    return {
      // Kiểm tra trạng thái đăng nhập (0: chưa kiểm tra, 1: đã đăng nhập, 2: chưa đăng nhập)
      checkLoginStatus: 0,

      // Tên và ảnh đại diện của người dùng đang đăng nhập
      userFullName: '',
      avatar: '',
    }
  },

  mounted() {
    // Thực hiện kiểm tra đăng nhập luôn
    this.checkLogin()
  },

  methods: {
    /**
     * Kiểm tra người dùng đã đăng nhập hay chưa.
     */
    async checkLogin() {
      const token = getToken()

      let userFullName = ''
      let avatar = ''
      if (token) {
        const { data } = await axios.get('/me') // Có thể gọi đến /me ở sso-passport
        if (data.code == 0) {
          const user = data.user
          userFullName = user.full_name
          avatar = user.avatar
        } else {
          // Xóa token đã hết hạn
          deleteToken()
        }
      }

      this.userFullName = userFullName
      this.avatar = avatar
      this.checkLoginStatus = userFullName ? 1 : 2
    },

    /**
     * Thực hiện đăng xuất.
     */
    async processLogout() {
      // Gọi API đăng xuất ở passport
      // Có thể gọi đến /api/logout ở sso-passport
      await axios.post('/logout')

      // Xóa token
      deleteToken()

      // Chuyển về trạng thái chưa đăng nhập
      this.userFullName = ''
      this.avatar = ''
      this.checkLoginStatus = 2

      // Nếu là trang xem tin tức thì phải load lại, vì có phần bình luận
      // TODO: Nên sử dụng pubsub
      if (location.pathname.startsWith('/tin-tuc/')) {
        location.reload()
      }
    },
  },
}).mount('#loginLink')

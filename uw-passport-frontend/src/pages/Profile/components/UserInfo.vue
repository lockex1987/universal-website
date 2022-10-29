<template>
  <form @submit.prevent="updateInfo()">
    <div class="mb-3 form-control-max-width py-4 text-center">
      <label class="d-block mb-0 cursor-pointer">
        <img
          class="rounded-circle avatar object-fit-cover image-box-shadow"
          :src="loginUser?.avatar || '/images/user_avatar.png'"
          title="Đổi ảnh đại diện"
          onerror="this.src = '/images/user_avatar.png'"
          ref="theImage"
        />

        <input
          type="file"
          ref="avatarFile"
          @change="previewAvatar()"
          accept=".png,.jpg,.jpeg,.gif;capture=camera"
          class="d-none"
        />
      </label>

      <div class="text-muted font-size-0.75 mt-3">
        * Click vào ảnh đại diện để đổi ảnh
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">
        Tài khoản
      </label>

      <div class="text-body">
        {{ loginUser?.username }}
      </div>
    </div>

    <div class="mb-3 validate-container">
      <label class="form-label required">
        Tên hiển thị
      </label>

      <input
        type="text"
        v-model.trim="fullName"
        class="form-control form-control-max-width"
        data-validation="required"
      />
    </div>

    <div class="mb-3 validate-container">
      <label class="form-label required">
        Email
      </label>

      <input
        type="text"
        v-model.trim="email"
        class="form-control form-control-max-width"
        data-validation="required|email"
      />
    </div>

    <div class="mb-3 validate-container">
      <label class="form-label form-label">
        Số điện thoại
      </label>

      <input
        type="text"
        v-model.trim="phone"
        class="form-control form-control-max-width"
        data-validation="phone|maxLength:20"
      />
    </div>

    <div>
      <button
        class="btn btn-primary"
        type="submit"
      >
        Lưu thông tin
      </button>

      <button
        class="btn btn-outline-primary ms-3"
        type="button"
        @click="initInfo()"
      >
        Hủy
      </button>
    </div>
  </form>
</template>


<script>
export default {
  data() {
    return {
      // Tên hiển thị
      fullName: '',

      // Địa chỉ email
      email: '',

      // Số điện thoại
      phone: '',

      // File upload ảnh avatar
      avatar: null,
    }
  },

  mounted() {
    // this.initInfo()
  },

  methods: {
    /**
     * Lấy thông tin người dùng.
     */
    initInfo() {
      this.fullName = this.loginUser.full_name
      this.email = this.loginUser.email
      this.phone = this.loginUser.phone
      this.avatar = null
      this.$refs.avatarFile.value = ''
      this.$refs.theImage.src = this.loginUser.avatar
    },

    /**
     * Cập nhật lại thông tin.
     */
    async updateInfo() {
      /*
      if (CV.invalidForm(this.$el)) {
        return
      }
      */

      const params = new FormData()
      params.append('fullName', this.fullName)
      params.append('email', this.email)
      params.append('phone', this.phone)
      if (this.avatar) {
        params.append('avatar', this.avatar)
      }

      const { data } = await axios.post('/user', params)
      if (data.code == 0) {
        // Cập nhật lại vuex (thông tin email)
        this.loginUser.full_name = this.fullName
        this.loginUser.email = this.email
        this.loginUser.phone = this.phone
        this.loginUser.avatar = data.avatar

        this.$store.commit('auth/setUser', this.loginUser)

        this.initInfo()

        noti.success('Cập nhật thông tin thành công')
      } else if (data.code == 1) {
        noti.error(data.message)
      }
    },

    /**
     * Xem trước ảnh avatar khi chọn file ảnh.
     */
    previewAvatar() {
      this.avatar = this.$refs.avatarFile.files[0]
      this.$refs.theImage.src = URL.createObjectURL(this.avatar)
    },
  },
}
</script>


<style scoped>
.avatar {
  width: 100px;
  height: 100px;
}
</style>

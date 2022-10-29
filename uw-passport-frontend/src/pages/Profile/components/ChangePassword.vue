<template>
  <form @submit.prevent="changePassword()">
    <div class="mb-3 validate-container">
      <label class="form-label required">
        Mật khẩu cũ
      </label>

      <div class="input-group form-control-max-width">
        <input
          v-model.trim="oldPassword"
          :type="showOldPassword ? 'text' : 'password'"
          class="form-control"
          placeholder="Mật khẩu cũ"
          data-validation="required"
          autocomplete="new-password"
        />

        <span
          class="input-group-text cursor-pointer"
          @click="toggleOldPassword()"
          :title="showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        >
          <i
            class="la"
            :class="[showOldPassword ? 'la-eye-slash' : 'la-eye']"
          ></i>
        </span>
      </div>
    </div>

    <div class="mb-3 validate-container">
      <label class="form-label required">
        Mật khẩu mới
      </label>

      <div class="input-group form-control-max-width">
        <input
          v-model.trim="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          class="form-control"
          placeholder="Mật khẩu mới"
          data-validation="required|minLength:8|maxLength:50"
          autocomplete="new-password"
          @keydown="handleCapsLockWarning($event)"
        />
        <!-- password|passwordStrong -->

        <span
          class="input-group-text cursor-pointer"
          @click="toggleNewPassword()"
          :title="showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        >
          <i
            class="la"
            :class="[showNewPassword ? 'la-eye-slash' : 'la-eye']"
          ></i>
        </span>
      </div>

      <div
        class="mt-1 font-size-0.875 text-warning"
        v-show="isCapsLockOn"
      >
        * Đang bật Caps Lock
      </div>
    </div>

    <div>
      <button
        class="btn btn-primary btn-ripple"
        type="submit"
      >
        Đổi mật khẩu
        <span
          class="spinner-border spinner-border-sm"
          v-show="isProcessing"
        ></span>
      </button>

      <button
        class="btn btn-outline-primary btn-ripple ms-3"
        type="button"
        @click="cancelForm()"
      >
        Hủy
      </button>
    </div>
  </form>
</template>


<script setup>
export default {
  data() {
    return {
      // Mật khẩu cũ
      oldPassword: '',
      showOldPassword: false,

      // Mật khẩu mới
      newPassword: '',
      showNewPassword: false,

      // Đánh dấu đang xử lý
      isProcessing: false,

      // Có phải đang bật Caps Lock hay không
      isCapsLockOn: false,
    }
  },

  methods: {
    /**
     * Khi Caps Lock đang được bật thì cảnh báo người dùng.
     * Đơn giản, nhưng rất hữu ích.
     */
    handleCapsLockWarning(evt) {
      // Thêm đoạn kiểm tra getModifierState vì khi focus thì bị lỗi
      if (evt.getModifierState) {
        this.isCapsLockOn = evt.getModifierState('CapsLock')
      }
    },

    /**
     * Ẩn / hiện password cũ.
     */
    toggleOldPassword() {
      this.showOldPassword = !this.showOldPassword
    },

    /**
     * Ẩn / hiện password mới.
     */
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword
    },

    /**
     * Đổi mật khẩu.
     */
    async changePassword() {
      if (this.isProcessing) {
        return
      }

      if (CV.invalidForm(this.$el)) {
        return
      }

      this.isProcessing = true
      const params = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      }
      const { data } = await axios.post('/change-password', params)
      this.isProcessing = false

      if (data.code == 0) {
        this.cancelForm()
        noti.success('Đổi mật khẩu thành công')
      } else if (data.code == 1) {
        noti.error(data.message)
      }
    },

    /**
     * Nhấn nút hủy.
     */
    cancelForm() {
      // Xóa các thông báo lỗi (nếu có)
      CV.clearErrorMessages(this.$el)

      // Reset lại form
      this.oldPassword = ''
      this.newPassword = ''
      this.showOldPassword = false
      this.showNewPassword = false
    },
  },
}
</script>

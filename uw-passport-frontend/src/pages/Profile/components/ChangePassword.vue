<template>
  <form
    @submit.prevent="changePassword()"
    ref="root"
  >
    <div class="mb-3 validate-container">
      <label class="form-label required">
        Mật khẩu cũ
      </label>

      <div class="input-group form-control-max-width">
        <input
          :type="showOldPassword ? 'text' : 'password'"
          class="form-control"
          placeholder="Mật khẩu cũ"
          v-model.trim="oldPassword"
          data-validation="required"
          autocomplete="off"
        />

        <span
          class="input-group-text cursor-pointer"
          @click="toggleOldPassword()"
          :title="showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        >
          <i
            class="bi"
            :class="[showOldPassword ? 'bi-eye-slash' : 'bi-eye']"
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
          :type="showNewPassword ? 'text' : 'password'"
          class="form-control"
          placeholder="Mật khẩu mới"
          v-model.trim="newPassword"
          data-validation="required|minLength:8|maxLength:50"
          autocomplete="off"
          @keydown="handleCapsLockWarning($event)"
        />
        <!-- password|passwordStrong -->

        <span
          class="input-group-text cursor-pointer"
          @click="toggleNewPassword()"
          :title="showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        >
          <i
            class="bi"
            :class="[showNewPassword ? 'bi-eye-slash' : 'bi-eye']"
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
          v-show="isProcessing"
          class="spinner-border spinner-border-sm"
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
import axios from 'axios'
import { ref } from 'vue'

const oldPassword = ref('')
const showOldPassword = ref(false)
const newPassword = ref('')
const showNewPassword = ref(false)
const isProcessing = ref(false)
const isCapsLockOn = ref(false)
const root = ref(null)

const handleCapsLockWarning = evt => {
  // Thêm đoạn kiểm tra getModifierState vì khi focus thì bị lỗi
  if (evt.getModifierState) {
    isCapsLockOn.value = evt.getModifierState('CapsLock')
  }
}

const toggleOldPassword = () => {
  showOldPassword.value = ! showOldPassword.value
}

const toggleNewPassword = () => {
  showNewPassword.value = ! showNewPassword.value
}

const changePassword = async () => {
  if (isProcessing.value) {
    return
  }

  /*
  if (CV.invalidForm(root.value)) {
    return
  }
  */

  isProcessing.value = true
  const params = {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  }
  const { data } = await axios.post('/api/profile/change-password', params)
  isProcessing.value = false

  if (data.code == 0) {
    cancelForm()
    noti.success('Đổi mật khẩu thành công')
  } else if (data.code == 1) {
    noti.error(data.message)
  }
}

const cancelForm = () => {
  // CV.clearErrorMessages(root.value)

  oldPassword.value = ''
  newPassword.value = ''
  showOldPassword.value = false
  showNewPassword.value = false
}
</script>

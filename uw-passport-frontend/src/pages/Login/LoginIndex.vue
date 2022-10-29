<template>
  <div
    class="mx-auto mt-5"
    style="max-width: 500px"
  >
    <form @submit.prevent="processLogin()">
      <div
        v-show="errorMessage"
        class="mb-3 text-center text-danger"
      >
        {{ errorMessage }}
      </div>

      <div class="mb-3 validate-container">
        <input
          type="text"
          class="form-control form-control-rounded"
          placeholder="Tên đăng nhập"
          v-model.trim="username"
          data-validation="required"
          autofocus
          autocomplete="off"
          spellcheck="false"
        />
      </div>

      <div class="mb-3 validate-container">
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control form-control-rounded"
            placeholder="Mật khẩu"
            v-model.trim="password"
            data-validation="required"
            autocomplete="off"
            @keydown="handleCapsLockWarning($event)"
          >

          <span
            class="input-group-text cursor-pointer input-group-text-rounded"
            @click="togglePassword()"
            :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
          >
            <i
              class="bi"
              :class="[showPassword ? 'bi-eye-slash' : 'bi-eye']"
            ></i>
          </span>
        </div>

        <div
          v-show="isCapsLockOn"
          class="mt-1 font-size-0.875 text-warning"
        >
          * Đang bật Caps Lock
        </div>
      </div>

      <div class="mb-3">
        <button
          class="btn btn-primary w-100 btn-ripple btn-rounded"
          type="submit"
        >
          Đăng nhập
          <span
            v-show="isProcessing"
            class="spinner-border spinner-border-sm"
          ></span>
        </button>
      </div>
    </form>
  </div>
</template>


<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
// import { setToken } from '@/helpers/sso'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const isProcessing = ref(false)
const isCapsLockOn = ref(false)

const processLogin = async () => {
  if (isProcessing.value) {
    return
  }

  isProcessing.value = true
  const params = {
    username: username.value,
    password: password.value,
  }
  const { data } = await axios.post('/login', params)
  isProcessing.value = false

  if (data.code == 0) {
    errorMessage.value = ''
    // setToken(data.token)
    authStore.user = data.user
    const defaultPagePath = '/Backend/Profile'
    router.push(authStore.beforeLoginPath || defaultPagePath)
    authStore.beforeLoginPath = ''
  } else if (data.code == 1) {
    errorMessage.value = data.message
  }
}

const handleCapsLockWarning = evt => {
  // Thêm đoạn kiểm tra getModifierState vì khi focus thì bị lỗi
  if (evt.getModifierState) {
    isCapsLockOn.value = evt.getModifierState('CapsLock')
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

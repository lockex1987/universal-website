<template>
  <div
    class="mx-auto mt-5"
    style="max-width: 500px"
  >
    <div
      v-show="errorMessage"
      class="mb-3 text-center text-danger"
    >
      {{ errorMessage }}
    </div>

    <a-form
      :model="frm"
      @finish="processLogin"
      layout="vertical"
    >
      <a-form-item
        label="Tên đăng nhập"
        name="username"
        :rules="[{ required: true }]"
      >
        <!-- Tự động trim rồi? -->
        <a-input v-model:value="frm.username" />
      </a-form-item>

      <a-form-item
        label="Mật khẩu"
        name="password"
        :rules="[{ required: true }]"
      >
        <a-input-password
          v-model:value="frm.password"
          autocomplete="off"
        />
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          class="w-100"
        >
          Đăng nhập
          <span
            v-show="isProcessing"
            class="spinner-border spinner-border-sm"
          ></span>
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const frm = reactive({
  username: '',
  password: '',
})

const errorMessage = ref('')
const isProcessing = ref(false)

const processLogin = async () => {
  if (isProcessing.value) {
    return
  }

  isProcessing.value = true
  const params = {
    ...frm,
  }
  const { data } = await axios.post('/api/auth/login', params)
  isProcessing.value = false

  if (data.code == 0) {
    errorMessage.value = ''
    authStore.user = data.user
    const defaultPagePath = '/Backend/Profile'
    router.push(authStore.beforeLoginPath || defaultPagePath)
    authStore.beforeLoginPath = ''
  } else if (data.code == 1) {
    errorMessage.value = data.message
  }
}
</script>

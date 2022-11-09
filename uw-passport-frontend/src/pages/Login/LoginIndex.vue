<template>
  <div
    class="mx-auto mt-5"
    style="max-width: 500px"
  >
    <div class="text-center mb-3">
      <img
        src="/static/images/logo.svg"
        style="width: 5rem"
      />
    </div>

    <div
      v-show="errorMessage"
      class="mb-3 text-center text-danger"
    >
      {{ errorMessage }}
    </div>

    <a-form
      :model="frm"
      :rules="rules"
      @finish="processLogin"
      layout="vertical"
    >
      <a-form-item
        label="Tên đăng nhập"
        name="username"
      >
        <a-input v-model:value.lazy.trim="frm.username" />
      </a-form-item>

      <a-form-item
        label="Mật khẩu"
        name="password"
      >
        <a-input-password
          v-model:value.lazy.trim="frm.password"
          autocomplete="off"
        />
      </a-form-item>

      <div>
        <a-button
          type="primary"
          html-type="submit"
          block
          :loading="isProcessing"
        >
          Đăng nhập
        </a-button>
      </div>
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

const rules = {
  username: [{ required: true }],
  password: [{ required: true }],
}

const errorMessage = ref('')

const isProcessing = ref(false)

const processLogin = async () => {
  isProcessing.value = true
  const params = frm
  const { data } = await axios.post('/api/auth/login', params)
  isProcessing.value = false

  if (data.code == 0) {
    errorMessage.value = ''
    authStore.user = data.user
    const defaultPagePath = '/Backend/Dashboard'
    router.push(authStore.beforeLoginPath || defaultPagePath)
    authStore.beforeLoginPath = ''
  } else if (data.code == 1) {
    errorMessage.value = data.message
  }
}
</script>

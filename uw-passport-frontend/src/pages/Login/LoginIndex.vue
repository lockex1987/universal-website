<template>
  <div
    class="mx-auto mt-5 text-center"
    style="max-width: 500px"
  >
    <div v-show="screen == 'login'">
      <div class="mb-4">
        <img
          src="/static/images/logo.svg"
          style="width: 5rem"
        />
      </div>

      <div
        v-show="errorMessage"
        class="mb-4 text-danger"
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

    <div v-show="screen == 'qr'">
      <div class="mb-4">
        <canvas
          class="qr-image"
          ref="qrImage"
        ></canvas>
      </div>

      <div>
        Sử dụng Google Authenticator để quét mã QR trên
      </div>
    </div>

    <div v-show="screen == 'totp'">
    </div>
  </div>
</template>


<script setup>
import { setLogin, beforeLoginPath } from '@/stores/auth.js'

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

// login, qr, totp
const screen = ref('login')

const qrImage = ref()

const processLogin = async () => {
  isProcessing.value = true
  const params = frm
  const { data } = await axios.post('/api/auth/login', params)
  isProcessing.value = false

  if (data.code == 0) {
    errorMessage.value = ''
    setLogin(data.user)
    const defaultPagePath = '/Backend/Dashboard'
    router.push(beforeLoginPath.value || defaultPagePath)
    beforeLoginPath.value = ''
  } else if (data.code == 1) {
    errorMessage.value = data.message
  }
}
</script>

<template>
  <div
    class="mx-auto mt-5"
    style="max-width: 500px"
  >
    <div v-show="screen == 'login'">
      <div class="mb-4 text-center">
        <img
          src="/static/images/logo.svg"
          style="width: 5rem"
        />
      </div>

      <div
        v-show="errorMessage"
        class="mb-4 text-center text-danger"
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
      <div class="mb-4 text-center">
        <canvas
          class="qr-image"
          ref="qrImage"
        ></canvas>
      </div>

      <div class="mb-4 text-center">
        Sử dụng Google Authenticator để quét mã QR trên
      </div>

      <div>
        <a-button
          type="primary"
          block
          @click="screen = 'totp'"
        >
          Tiếp tục
        </a-button>
      </div>
    </div>

    <div v-show="screen == 'totp'">
      <div
        v-show="errorMessage"
        class="mb-4 text-center text-danger"
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
          label="Mã TOTP"
          name="totpCode"
        >
          <a-input v-model:value.lazy.trim="frm.totpCode" />
        </a-form-item>

        <div class="mb-4">
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="isProcessing"
          >
            Đăng nhập
          </a-button>
        </div>

        <div>
          <a-button
            block
            @click="returnLoginScreen()"
          >
            Quay lại
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>


<script setup>
import QRious from 'qrious'
import { setLogin, beforeLoginPath } from '@/stores/auth.js'

const router = useRouter()

const frm = reactive({
  username: '',
  password: '',
  totpCode: '',
})

const rules = {
  username: [{ required: true }],
  password: [{ required: true }],
  totpCode: [{ required: true }],
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
    // Đăng nhập thành công
    errorMessage.value = ''
    setLogin(data.user)
    const defaultPagePath = '/Backend/Dashboard'
    router.push(beforeLoginPath.value || defaultPagePath)
    beforeLoginPath.value = ''
  } else if (data.code == 1) {
    // Lỗi
    errorMessage.value = data.message
  } else if (data.code == 2) {
    // Hiển thị mã QR
    screen.value = 'qr'
    new QRious({
      element: qrImage.value,
      value: data.totp.uri
    })
  } else if (data.code == 3) {
    // Hiển thị nhập TOTP code
    screen.value = 'totp'
  }
}

const returnLoginScreen = () => {
  screen.value = 'login'
  errorMessage.value = ''
  Object.assign(frm, {
    username: '',
    password: '',
    totpCode: '',
  })
}
</script>


<style scoped>
.qr-image {
  width: 200px;
  height: 200px;
}
</style>

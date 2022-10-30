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

    <ElForm
      ref="frmRef"
      :model="frm"
      :rules="rules"
      label-position="top"
      @submit.prevent="processLogin()"
    >

      <ElFormItem
        label="Tên đăng nhập"
        prop="username"
      >
        <ElInput
          v-model.trim="frm.username"
          autocomplete="off"
        />
      </ElFormItem>

      <ElFormItem
        label="Mật khẩu"
        prop="password"
      >
        <ElInput
          v-model.trim="frm.password"
          autocomplete="off"
          @keydown="handleCapsLockWarning($event)"
          type="password"
          show-password
        />
      </ElFormItem>

      <div
        v-show="isCapsLockOn"
        class="mb-3 mt-1 font-size-0.875 text-warning"
      >
        * Đang bật Caps Lock
      </div>

      <ElFormItem>
        <ElButton
          type="primary"
          native-type="submit"
          class="w-100"
        >
          Đăng nhập
          <span
            v-show="isProcessing"
            class="spinner-border spinner-border-sm"
          ></span>
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const frmRef = ref()
const frm = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [
    // TODO: Vẫn thông báo tiếng Việt
    { required: true, messagex: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
  ],
  password: [
    { required: true, messagex: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
  ],
})

const errorMessage = ref('')
const isProcessing = ref(false)
const isCapsLockOn = ref(false)

const processLogin = async () => {
  if (isProcessing.value) {
    return
  }

  // Reset form => frmRef.value.resetFields()
  //
  // Unhandled error during execution of native event handler
  const isValid = await frmRef.value.validate((valid, fields) => {})
  if (! isValid) {
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

const handleCapsLockWarning = evt => {
  // Thêm đoạn kiểm tra getModifierState vì khi focus thì bị lỗi
  if (evt.getModifierState) {
    isCapsLockOn.value = evt.getModifierState('CapsLock')
  }
}
</script>

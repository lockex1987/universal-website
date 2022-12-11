<template>
  <!-- Có cần modal ở a-form hay chỉ cần ở a-input? -->
  <!-- Thiết lập form layout là vertical mặc định -->
  <a-form
    :model="frm"
    ref="frmRef"
    :rules="rules"
    @finish="changePassword()"
    layout="vertical"
  >
    <!-- Có cần thuộc tính name? -->
    <a-form-item
      label="Mật khẩu cũ"
      name="oldPassword"
    >
      <a-input-password
        v-model:value.lazy.trim="frm.oldPassword"
        autocomplete="off"
        class="form-control-max-width"
      />
    </a-form-item>

    <!-- password|passwordStrong -->
    <a-form-item
      label="Mật khẩu mới"
      name="newPassword"
    >
      <a-input-password
        v-model:value.lazy.trim="frm.newPassword"
        autocomplete="off"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-space>
      <a-button
        type="primary"
        html-type="submit"
        :loading="isProcessing"
      >
        Đổi mật khẩu
        <span
          v-show="isProcessing"
          class="spinner-border spinner-border-sm"
        ></span>
      </a-button>

      <a-button @click="cancelForm()">
        Hủy
      </a-button>
    </a-space>
  </a-form>
</template>


<script setup>
const frm = reactive({
  oldPassword: '',
  newPassword: '',
})

const frmRef = ref()

const rules = {
  oldPassword: [{ required: true }],
  newPassword: [{ required: true, max: 100 }],
}

const isProcessing = ref(false)

const changePassword = async () => {
  isProcessing.value = true
  const params = frm
  const { data } = await axios.post('/api/profile/change_password', params)
  isProcessing.value = false

  if (data.code == 0) {
    noti.success('Đổi mật khẩu thành công')
    cancelForm()
  } else if (data.code == 1) {
    noti.error(data.message)
  }
}

const cancelForm = () => {
  frmRef.value.resetFields()
  Object.assign(frm, {
    oldPassword: '',
    newPassword: '',
  })
}
</script>

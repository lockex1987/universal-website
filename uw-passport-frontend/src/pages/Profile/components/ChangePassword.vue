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
        v-model:value="frm.oldPassword"
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
        v-model:value="frm.newPassword"
        autocomplete="off"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
      >
        Đổi mật khẩu
        <span
          v-show="isProcessing"
          class="spinner-border spinner-border-sm"
        ></span>
      </a-button>

      <a-button
        type="secondary ms-3"
        @click="cancelForm()"
      >
        Hủy
      </a-button>
    </a-form-item>
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
  newPassword: [{ required: true }],
}
const isProcessing = ref(false)

const changePassword = async () => {
  if (isProcessing.value) {
    return
  }

  isProcessing.value = true
  const params = {
    ...frm,
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
  // TODO: Clear Error Messages
  frmRef.value.resetFields()

  /*
  frm.value = {
    oldPassword: '',
    newPassword: '',
  }
  */

  frm.oldPassword = ''
  frm.newPassword = ''
}
</script>

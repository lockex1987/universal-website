<template>
  <a-form
    :model="frm"
    ref="frmRef"
    :rules="rules"
    @finish="updateInfo()"
    layout="vertical"
  >
    <div class="mb-3 form-control-max-width py-4 text-center">
      <label class="d-block mb-0 cursor-pointer">
        <img
          class="rounded-circle avatar object-fit-cover"
          title="Đổi ảnh đại diện"
          onerror="this.src = '/static/images/user_avatar.png'"
          ref="avatarImgTag"
        />

        <input
          type="file"
          ref="avatarFileInputTag"
          @change="previewAvatar()"
          accept=".png, .jpg, .jpeg, .gif; capture=camera"
          class="d-none"
        />
      </label>

      <div class="text-muted font-size-0.75 mt-3">
        * Click vào ảnh đại diện để đổi ảnh
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">
        Tài khoản
      </label>

      <div class="text-body">
        {{ authStore.user?.username }}
      </div>
    </div>

    <a-form-item
      label="Tên hiển thị"
      name="fullName"
    >
      <a-input
        v-model:value="frm.fullName"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Email"
      name="email"
    >
      <a-input
        v-model:value="frm.email"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Số điện thoại"
      name="phone"
    >
      <a-input
        v-model:value="frm.phone"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
      >
        Lưu thông tin
      </a-button>

      <a-button
        type="secondary"
        class="ms-3"
        @click="initInfo()"
      >
        Hủy
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const frm = reactive({
  fullName: '',
  email: '',
  phone: '',
})

const rules = {
  fullName: [{ required: true }],
  email: [{ type: 'email', required: true }],
  phone: [{ required: false, min: 9, max: 12 }],
}

const frmRef = ref()

const avatarImgTag = ref()

const avatarFileInputTag = ref()

const initInfo = () => {
  const loginUser = authStore.user
  frm.fullName = loginUser.fullName
  frm.email = loginUser.email
  frm.phone = loginUser.phone

  avatarFileInputTag.value.value = ''
  avatarImgTag.value.src = loginUser.avatar ? ('/' + loginUser.avatar) : '/static/images/user_avatar.png'
}

const updateInfo = async () => {
  const params = new FormData()
  params.append('fullName', frm.fullName)
  params.append('email', frm.email)
  params.append('phone', frm.phone)

  const avatarFile = avatarFileInputTag.value.files[0]
  if (avatarFile) {
    params.append('avatar', avatarFile)
  }

  const { data } = await axios.post('/api/profile/update-user-info', params)
  if (data.code == 0) {
    authStore.user = {
      ...authStore.user,
      fullName: frm.fullName,
      email: frm.email,
      phone: frm.phone,
      avatar: data.avatar,
      thumbnail: data.thumbnail,
    }
    initInfo()
    noti.success('Cập nhật thông tin thành công')
  } else if (data.code == 1) {
    noti.error(data.message)
  }
}

const previewAvatar = () => {
  const avatarFile = avatarFileInputTag.value.files[0]
  avatarImgTag.value.src = URL.createObjectURL(avatarFile)
}

onMounted(() => {
  initInfo()
})
</script>

<style scoped>
.avatar {
  width: 100px;
  height: 100px;
}
</style>

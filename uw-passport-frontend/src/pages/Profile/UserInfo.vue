<template>
  <a-form
    :model="frm"
    ref="frmRef"
    :rules="rules"
    @finish="saveForm()"
    layout="vertical"
  >
    <div class="mb-3 mt-3 form-control-max-width py-4 text-center">
      <a-form-item name="avatar">
        <a-upload
          v-model:file-list="frm.avatar"
          name="avatar"
          list-type="picture-card"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          accept=".png, .jpg, .jpeg, .gif; capture=camera"
        >
          <img
            :src="imageUrl"
            class="rounded avatar object-fit-cover"
            onerror="this.src = '/static/images/user_avatar.png'"
          />
        </a-upload>
      </a-form-item>

      <div class="text-muted font-size-0.75 mt-3">
        * Click vào ảnh đại diện để đổi ảnh
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">
        Tên đăng nhập
      </label>

      <div class="text-body">
        {{ authStore.user?.username }}
      </div>
    </div>

    <a-form-item
      label="Tên đầy đủ"
      name="fullName"
    >
      <a-input
        v-model:value.lazy.trim="frm.fullName"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Email"
      name="email"
    >
      <a-input
        v-model:value.lazy.trim="frm.email"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Số điện thoại"
      name="phone"
    >
      <a-input
        v-model:value.lazy.trim="frm.phone"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-space>
      <a-button
        type="primary"
        html-type="submit"
      >
        Lưu thông tin
      </a-button>

      <a-button @click="initInfo()">
        Hủy
      </a-button>
    </a-space>
  </a-form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const frm = reactive({
  fullName: '',
  email: '',
  phone: '',
  avatar: [],
})

const rules = {
  fullName: [{ required: true }],
  email: [{ type: 'email', required: true }],
  phone: [{ required: false, min: 9, max: 12 }],
  avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5 }],
}

const frmRef = ref()

const imageUrl = ref('')

const initInfo = () => {
  const loginUser = authStore.user
  frm.fullName = loginUser.fullName
  frm.email = loginUser.email
  frm.phone = loginUser.phone
  frm.avatar = []
  imageUrl.value = loginUser.avatar ? ('/' + loginUser.avatar) : '/static/images/user_avatar.png'
}

const beforeUpload = file => {
  // Preview
  imageUrl.value = URL.createObjectURL(file)

  // Không upload AJAX
  return false
}

const saveForm = async () => {
  const params = new FormData()
  params.append('fullName', frm.fullName)
  params.append('email', frm.email)
  params.append('phone', frm.phone)

  // Lấy phần tử file cuối cùng
  const fileList = frm.avatar
  const temp = fileList.length ? fileList[fileList.length - 1] : null
  if (temp) {
    const avatarFile = temp.originFileObj
    params.append('avatar', avatarFile)
  }

  const { data } = await axios.post('/api/profile/update-user-info', params)
  if (data.code == 0) {
    // Object.assign(authStore.user, frm, data)
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

onMounted(() => {
  initInfo()
})
</script>


<style scoped>
.avatar {
  width: 104px;
  height: 104px;
}
</style>

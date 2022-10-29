<template>
  <form
    ref="root"
    @submit.prevent="updateInfo()"
  >
    <div class="mb-3 form-control-max-width py-4 text-center">
      <label class="d-block mb-0 cursor-pointer">
        <img
          class="rounded-circle avatar object-fit-cover image-box-shadow"
          title="Đổi ảnh đại diện"
          onerror="this.src = '/images/user_avatar.png'"
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

    <div class="mb-3 validate-container">
      <label class="form-label required">
        Tên hiển thị
      </label>

      <input
        type="text"
        v-model.trim="fullName"
        class="form-control form-control-max-width"
        data-validation="required"
      />
    </div>

    <div class="mb-3 validate-container">
      <label class="form-label required">
        Email
      </label>

      <input
        type="text"
        v-model.trim="email"
        class="form-control form-control-max-width"
        data-validation="required|email"
      />
    </div>

    <div class="mb-3 validate-container">
      <label class="form-label form-label">
        Số điện thoại
      </label>

      <input
        type="text"
        v-model.trim="phone"
        class="form-control form-control-max-width"
        data-validation="phone|maxLength:20"
      />
    </div>

    <div>
      <button
        class="btn btn-primary"
        type="submit"
      >
        Lưu thông tin
      </button>

      <button
        class="btn btn-outline-primary ms-3"
        type="button"
        @click="initInfo()"
      >
        Hủy
      </button>
    </div>
  </form>
</template>


<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const phone = ref('')

const root = ref(null)
const avatarImgTag = ref(null)
const avatarFileInputTag = ref(null)

const initInfo = () => {
  const loginUser = authStore.user
  fullName.value = loginUser.full_name
  email.value = loginUser.email
  phone.value = loginUser.phone

  avatarFileInputTag.value.value = ''
  avatarImgTag.value.src = loginUser.avatar || '/images/user_avatar.png'
}

const updateInfo = async () => {
  /*
  if (CV.invalidForm(root.value)) {
    return
  }
  */

  const params = new FormData()
  params.append('fullName', fullName.value)
  params.append('email', email.value)
  params.append('phone', phone.value)

  const avatarFile = avatarFileInputTag.value.files[0]
  if (avatarFile) {
    params.append('avatar', avatarFile)
  }

  const { data } = await axios.post('/api/profile/user', params)
  if (data.code == 0) {
    authStore.user = {
      ...authStore.user,
      full_name: fullName.value,
      email: email.value,
      phone: phone.value,
      avatar: data.avatar,
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

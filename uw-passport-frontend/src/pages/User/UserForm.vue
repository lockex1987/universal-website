<template>
  <a-breadcrumb class="mb-3">
    <a-breadcrumb-item>Người dùng</a-breadcrumb-item>
    <a-breadcrumb-item>
      {{ actionName }}
    </a-breadcrumb-item>
  </a-breadcrumb>

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

    <a-form-item
      label="Tài khoản"
      name="username"
    >
      <a-input
        v-model:value="frm.username"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Tên đầy đủ"
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

    <a-space>
      <a-button
        type="primary"
        html-type="submit"
      >
        {{ actionName }}
      </a-button>

      <a-button @click="closeForm()">
        Quay lại
      </a-button>
    </a-space>
  </a-form>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const frm = reactive({
  _id: '',
  username: '',
  fullName: '',
  email: '',
  phone: '',
  avatar: [],
})

const rules = {
  username: [{ required: true }],
  fullName: [{ required: true }],
  email: [{ type: 'email', required: true }],
  phone: [{ required: false, min: 9, max: 12 }],
  avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5 }],
}

const frmRef = ref()

const imageUrl = ref('')

const actionName = computed(() => {
  return frm._id == '0' ? 'Thêm mới' : 'Cập nhật'
})

const bindOldInfo = async () => {
  const { data } = await axios.get('/api/user/get/' + frm._id)
  const user = data
  frm.username = user.username
  frm.fullName = user.fullName
  frm.email = user.email
  frm.phone = user.phone
  frm.avatar = []
  imageUrl.value = user.avatar ? ('/' + user.avatar) : '/static/images/user_avatar.png'
}

const beforeUpload = file => {
  // Preview
  imageUrl.value = URL.createObjectURL(file)

  // Không upload AJAX
  return false
}

const saveForm = async () => {
  const params = new FormData()
  params.append('_id', frm._id)
  params.append('username', frm.username)
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

  const method = (frm._id == '0') ? 'post' : 'put'
  const path = (frm._id == '0') ? 'insert' : 'update'
  const { data } = await axios[method]('/api/user/' + path, params)
  if (data.code == 0) {
    closeForm()
    noti.success(actionName.value + ' thành công')
  } else if (data.code == 1) {
    noti.error(data.message)
  }
}

const closeForm = () => {
  router.push({ name: 'User' })
}

onMounted(() => {
  frm._id = route.params._id
  if (frm._id != '0') {
    bindOldInfo()
  }
})
</script>

<style scoped>
.avatar {
  width: 104px;
  height: 104px;
}
</style>

<template>
  <div class="mb-3 fw-bold">
    {{ action.actionName }}
    người dùng
  </div>

  <a-form
    :model="frm"
    :rules="rules"
    ref="frmRef"
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
      label="Tên đăng nhập"
      name="username"
    >
      <a-input
        v-model:value.lazy.trim="frm.username"
        class="form-control-max-width"
      />
    </a-form-item>

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

    <a-form-item
      label="Tổ chức"
      name="orgId"
    >
      <a-tree-select
        v-model:value="frm.orgId"
        :treeData="orgTree"
        showSearch
        :allowClear="false"
        class="form-control-max-width"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
      />
    </a-form-item>

    <a-form-item
      label="Trạng thái"
      name="isActive"
    >
      <a-radio-group v-model:value="frm.isActive">
        <a-radio :value="true">
          <span class="text-success">
            Hoạt động
          </span>
        </a-radio>

        <a-radio :value="false">
          <span class="text-danger">
            Đã khóa
          </span>
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <div class="mb-3">
      <div>
        <label class="form-label">
          Vai trò của người dùng
        </label>
      </div>

      <a-checkbox-group v-model:value="frm.roles">
        <div class="row">
          <div
            v-for="role in roleList"
            :key="role._id"
            class="col-md-12 d-flex mb-2"
          >
            <div class="pt-1">
              <a-checkbox :value="role._id" />
            </div>

            <div class="ms-2">
              <div>{{ role.code }}</div>
              <div class="text-muted">{{ role.name }}</div>
            </div>
          </div>
        </div>
      </a-checkbox-group>
    </div>

    <a-space>
      <a-button
        type="primary"
        html-type="submit"
        :loading="isSaving"
      >
        {{ action.actionName }}
      </a-button>

      <a-button @click="closeForm()">
        Quay lại
      </a-button>
    </a-space>
  </a-form>
</template>


<script setup>
defineProps({
  orgTree: Array,
  roleList: Array,
})

const defaultFrm = {
  _id: null,
  username: '',
  fullName: '',
  email: '',
  phone: '',
  avatar: [],
  orgId: null,
  isActive: true,
  roles: [],
}

const frm = reactive({ ...defaultFrm })

const rules = {
  username: [{ required: true, max: 100 }],
  fullName: [{ required: true, max: 100 }],
  email: [{ type: 'email', required: true, max: 100 }],
  phone: [{ min: 9, max: 12 }],
  avatar: [{ type: 'upload', extensions: ['png', 'jpg', 'jpeg'], maxFileSize: 5 }],
  orgId: [{ required: true }],
}

const frmRef = ref()

const imageUrl = ref('')

const isSaving = ref(false)

const emit = defineEmits(['close', 'inserted', 'updated'])

const action = computed(() => {
  if (frm._id) {
    return {
      actionName: 'Cập nhật',
      method: 'put',
      path: 'update',
      emitName: 'updated',
    }
  }

  return {
    actionName: 'Thêm mới',
    method: 'post',
    path: 'insert',
    emitName: 'inserted',
  }
})

const beforeUpload = file => {
  // Preview
  imageUrl.value = URL.createObjectURL(file)

  // Không upload AJAX
  return false
}

const saveForm = async () => {
  isSaving.value = true

  const params = new FormData()
  params.append('_id', frm._id)
  params.append('username', frm.username)
  params.append('fullName', frm.fullName)
  params.append('email', frm.email)
  params.append('phone', frm.phone)
  params.append('orgId', frm.orgId)
  params.append('isActive', frm.isActive)
  params.append('roles', JSON.stringify(frm.roles))

  // Lấy phần tử file cuối cùng
  const fileList = frm.avatar
  const temp = fileList.length ? fileList[fileList.length - 1] : null
  if (temp) {
    const avatarFile = temp.originFileObj
    params.append('avatar', avatarFile)
  }

  const { method, path, actionName, emitName } = action.value
  const { data } = await axios[method]('/api/users/' + path, params)

  isSaving.value = false

  if (data.code == 0) {
    noti.success(actionName + ' thành công')
    closeForm()
    emit(emitName)
  } else if (data.code == 1) {
    noti.error(data.message)
  }
}

const closeForm = () => {
  emit('close')
}

const openForm = row => {
  frmRef.value.resetFields()

  if (row) {
    Object.assign(frm, row)
    imageUrl.value = row.avatar
      ? (row.avatar.startsWith('http') ? row.avatar : '/' + row.avatar)
      : '/static/images/user_avatar.png'
  } else {
    Object.assign(frm, defaultFrm)
    imageUrl.value = '/static/images/user_avatar.png'
  }
  frm.avatar = []
}

defineExpose({
  openForm,
})
</script>


<style scoped>
.avatar {
  width: 104px;
  height: 104px;
}
</style>

<template>
  <div class="mb-3 fw-bold">
    {{ actionName }}
    tổ chức
  </div>

  <a-form
    :model="frm"
    ref="frmRef"
    :rules="rules"
    @finish="saveForm()"
    layout="vertical"
  >
    <a-form-item
      label="Tên"
      name="name"
    >
      <a-input
        v-model:value.lazy.trim="frm.name"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Mô tả"
      name="description"
    >
      <a-textarea
        v-model:value.lazy.trim="frm.description"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-space>
      <a-button
        type="primary"
        html-type="submit"
        :loading="isSaving"
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
const defaultFrm = {
  _id: null,
  name: '',
  description: '',
}

const frm = reactive(defaultFrm)

const rules = {
  name: [{ required: true, max: 100 }],
  description: [{ max: 500 }],
}

const frmRef = ref()

const isSaving = ref(false)

// Không khai báo sẽ có cảnh báo
const emit = defineEmits(['close', 'inserted', 'updated'])

const actionName = computed(() => {
  return frm._id ? 'Cập nhật' : 'Thêm mới'
})

const saveForm = async () => {
  isSaving.value = true

  const params = frm
  const method = frm._id ? 'put' : 'post'
  const path = frm._id ? 'update' : 'insert'
  const { data } = await axios[method]('/api/org/' + path, params)

  isSaving.value = false

  if (data.code == 0) {
    closeForm()
    noti.success(actionName.value + ' thành công')
    emit('close')
    emit(frm._id ? 'updated' : 'inserted')
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
  } else {
    Object.assign(frm, defaultFrm)
  }
}

defineExpose({
  openForm,
})
</script>

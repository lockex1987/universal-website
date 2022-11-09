<template>
  <div class="mb-3 fw-bold">
    {{ action.actionName }}
    vai trò
  </div>

  <a-form
    :model="frm"
    ref="frmRef"
    :rules="rules"
    @finish="saveForm()"
    layout="vertical"
  >
    <a-form-item
      label="Mã"
      name="code"
    >
      <a-input
        v-model:value.lazy.trim="frm.code"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-form-item
      label="Tên"
      name="name"
    >
      <a-input
        v-model:value.lazy.trim="frm.name"
        class="form-control-max-width"
      />
    </a-form-item>

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
const defaultFrm = {
  _id: null,
  code: '',
  name: '',
}

const frm = reactive({ ...defaultFrm })

const rules = {
  code: [{ required: true, max: 100 }],
  name: [{ required: true, max: 100 }],
}

const frmRef = ref()

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

const saveForm = async () => {
  isSaving.value = true

  const params = frm
  const { method, path, actionName, emitName } = action.value
  const { data } = await axios[method]('/api/roles/' + path, params)

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
  } else {
    Object.assign(frm, defaultFrm)
  }
}

defineExpose({
  openForm,
})
</script>

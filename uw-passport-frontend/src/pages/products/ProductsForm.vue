<template>
  <div class="mb-4 fw-bold">
    {{ action.actionName }}
    sản phẩm
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
      name="title"
    >
      <a-input v-model:value.lazy.trim="frm.title" />
    </a-form-item>

    <a-form-item
      label="Mô tả"
      name="description"
    >
      <a-textarea
        v-model:value.lazy.trim="frm.description"
        :autoSize="true"
      />
    </a-form-item>

    <div class="mb-4">
      <label class="form-label">
        HTML
      </label>

      <QuillEditor
        theme="snow"
        contentType="html"
        v-model:content="frm.content"
      />

      <div>
        {{ frm.content }}
      </div>
    </div>

    <a-form-item
      label="Ảnh"
      name="image"
    >
      <a-input v-model:value.lazy.trim="frm.image" />
    </a-form-item>

    <a-form-item
      label="Giá"
      name="price"
    >
      <a-input-number
        v-model:value="frm.price"
        addon-after="$"
        class="form-control-max-width"
      />
    </a-form-item>

    <a-space>
      <a-button
        type="primary"
        htmlType="submit"
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const defaultFrm = {
  _id: null,
  title: '',
  description: '',
  content: '',
  image: '',
  price: null,
}

const frm = reactive({ ...defaultFrm })

const rules = {
  title: [{ required: true, max: 200 }],
  description: [{ required: true, max: 500 }],
  content: [{ required: true, max: 5000 }],
  image: [{ type: 'url', required: true, max: 500 }],
  price: [{ type: 'number', required: true, max: 1_000_000_000, min: 0 }],
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
  const { data } = await axios[method]('/api/products/' + path, params)

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
  console.log(row.content)

  if (row) {
    Object.assign(frm, row)
    console.log(frm.content)
  } else {
    Object.assign(frm, defaultFrm)
  }
}

defineExpose({
  openForm,
})
</script>

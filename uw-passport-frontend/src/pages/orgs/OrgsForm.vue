<template>
  <div class="mb-4 fw-bold">
    {{ actionName }}
    tổ chức
  </div>

  <a-form
    layout="vertical"
    ref="frmRef"
    :model="frm"
    :rules="rules"
    @finish="saveForm()"
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

    <!-- Không search được, cần thêm treeNodeFilterProp="title" -->
    <!-- Mặc định đang search theo trường value chứ không phải title -->
    <!-- Trường key là gì? Tương tự value. Chỉ sử dụng value thôi, không sử dụng key. -->
    <a-form-item
      label="Tổ chức cha"
      name="parentId"
    >
      <a-tree-select
        v-model:value="frm.parentId"
        :treeData="orgTreeIgnoreUpdating"
        showSearch
        allowClear
        treeNodeFilterProp="title"
        class="form-control-max-width"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
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
        htmlType="submit"
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
import { getTreeDataIgnoreId } from '@/helpers/tree.js'

const props = defineProps({
  orgTree: Array,
})

const orgTreeIgnoreUpdating = computed(() => {
  if (! frm._id) {
    return props.orgTree
  }
  return getTreeDataIgnoreId(props.orgTree, frm._id)
})

const defaultFrm = {
  _id: null,
  name: '',
  parentId: null,
  description: '',
}

const frm = reactive({ ...defaultFrm })

const rules = {
  // name: [{ required: true, max: 100 }],
  description: [{ max: 500 }],
}

const frmRef = ref()

const isSaving = ref(false)

// Không khai báo sẽ có cảnh báo
const emit = defineEmits([
  'close',
  'inserted',
  'updated',
])

const actionName = computed(() => {
  return frm._id ? 'Cập nhật' : 'Thêm mới'
})

const saveForm = async () => {
  isSaving.value = true
  const params = {
    ...frm,
    // Test validate tổ chức cha không tồn tại
    // parentId: '63b67c14a35641f792d8f5c0',
  }
  const method = frm._id ? 'put' : 'post'
  const path = frm._id ? 'update' : 'insert'
  const { data } = await axios[method]('/api/orgs/' + path, params)
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

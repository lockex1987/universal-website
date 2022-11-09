<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Quyền</li>
    </ol>
  </Teleport>

  <div v-show="screen == 'list'">
    <div class="d-flex flex-wrap align-items-center">
      <a-input
        v-model:value="filter.text"
        class="form-control-max-width mb-3"
        placeholder="Tìm kiếm"
        @input="debouncedSearch()"
      />

      <a-button
        type="primary"
        @click="openForm()"
        class="mb-3 ms-auto"
      >
        Thêm mới
      </a-button>
    </div>

    <div
      v-show="pagi.total == 0"
      class="text-danger"
    >
      <a-empty />
    </div>

    <div v-show="pagi.total > 0">
      <div class="table-responsive-md">
        <table class="table table-borderless">
          <thead>
            <tr>
              <th class="text-end">
                #
              </th>
              <th>
                Mã
              </th>
              <th>
                Tên
              </th>
              <th class="text-center">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(permission, i) in permissionList"
              :key="permission._id"
            >
              <td class="text-end">
                {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
              </td>
              <td>
                {{ permission.code }}
              </td>
              <td>
                {{ permission.name }}
              </td>
              <td class="text-center">
                <i
                  class="cursor-pointer font-size-1.5 text-primary bi bi-pencil-square"
                  title="Cập nhật"
                  @click="openForm(permission)"
                />

                <i
                  class="cursor-pointer font-size-1.5 text-primary bi bi-trash ms-3"
                  title="Xóa"
                  @click="deleteRow(permission)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <a-pagination
        v-model:current="pagi.currentPage"
        :total="pagi.total"
        :hideOnSinglePage="true"
        :showSizeChanger="false"
        :showTotal="total => `Tìm thấy ${total} bản ghi`"
        @change="search"
      />
    </div>
  </div>

  <div v-show="screen == 'form'">
    <PermissionForm
      ref="frmRef"
      @close="screen = 'list'"
      @updated="search(pagi.currentPage)"
      @inserted="search(1)"
    />
  </div>
</template>


<script setup>
import PermissionForm from './PermissionForm.vue'
import { debounce } from '@/helpers/common.js'

const filter = reactive({
  text: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const permissionList = ref([])

const frmRef = ref()

const screen = ref('list')

const search = async page => {
  const params = {
    text: filter.text.trim(),
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/permission/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  permissionList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const openForm = permission => {
  frmRef.value.openForm(permission)
  screen.value = 'form'
}

const deleteRow = permission => {
  noti.confirm('Bạn có muốn xóa bản ghi?', async () => {
    const { data } = await axios.delete('/api/permission/delete/' + permission._id)
    if (data.code == 0) {
      noti.success('Xóa bản ghi thành công')
      search(1)
    }
  })
}

onMounted(() => {
  search(1)
})
</script>

<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Vai trò</li>
    </ol>
  </Teleport>

  <div v-show="screen == 'list'">
    <div class="d-flex flex-wrap align-items-center">
      <a-input
        v-model:value="filter.text"
        class="form-control-max-width mb-4"
        placeholder="Tìm kiếm"
        @input="debouncedSearch()"
      />

      <a-button
        type="primary"
        @click="openForm()"
        class="mb-4 ms-auto"
      >
        Thêm mới
      </a-button>

      <a-button
        type="primary"
        @click="openImportForm()"
        class="mb-4 ms-3"
      >
        Import
      </a-button>

      <a-button
        type="primary"
        @click="exportExcel()"
        class="mb-4 ms-3"
      >
        Export
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
              v-for="(role, i) in roleList"
              :key="role._id"
            >
              <td class="text-end">
                {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
              </td>
              <td>
                {{ role.code }}
              </td>
              <td>
                {{ role.name }}
              </td>
              <td class="text-center">
                <i
                  class="cursor-pointer text-primary bi bi-pencil-square"
                  title="Cập nhật"
                  @click="openForm(role)"
                />

                <i
                  class="cursor-pointer text-primary bi bi-trash ms-3"
                  title="Xóa"
                  @click="deleteRow(role)"
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
    <RolesForm
      ref="frmRef"
      @close="screen = 'list'"
      @updated="search(pagi.currentPage)"
      @inserted="search(1)"
    />
  </div>

  <RolesImport
    ref="rolesImport"
    @done="search(1)"
  />
</template>


<script setup>
import RolesForm from './RolesForm.vue'
import RolesImport from './RolesImport.vue'
import { debounce } from '@/helpers/common.js'
import { exportExcelCommon } from '@/helpers/excel.js'

const filter = reactive({
  text: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const roleList = ref([])

const frmRef = ref()

const rolesImport = ref()

const screen = ref('list')

const search = async page => {
  const params = {
    text: filter.text.trim(),
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/roles/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  roleList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const openForm = role => {
  frmRef.value.openForm(role)
  screen.value = 'form'
}

const deleteRow = role => {
  noti.confirm('Bạn có muốn xóa bản ghi?', async () => {
    const { data } = await axios.delete('/api/roles/delete/' + role._id)
    if (data.code == 0) {
      noti.success('Xóa bản ghi thành công')
      search(1)
    }
  })
}

const openImportForm = () => {
  rolesImport.value.openImportForm()
}

const exportExcel = async () => {
  const params = {
    text: filter.text.trim(),
  }
  const { data } = await axios.post('/api/roles/search', params)
  const list = data.list

  if (list.length == 0) {
    noti.warning('Không có dữ liệu')
    return
  }

  const columns = [
    {
      header: 'Mã',
      key: 'code',
      width: 20,
    },
    {
      header: 'Tên',
      key: 'name',
      width: 30,
    },
  ]
  const sheetName = 'Roles'
  const fileName = 'vai tro.xlsx'
  exportExcelCommon(list, columns, sheetName, fileName)
}

onMounted(() => {
  search(1)
})
</script>

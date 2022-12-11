<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Người dùng</li>
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
              <th class="text-center d-none d-md-table-cell">
                Avatar
              </th>
              <th>
                Tên đăng nhập
              </th>
              <th>
                Tên đầy đủ
              </th>
              <th>
                Email
              </th>
              <th>
                Số điện thoại
              </th>
              <th class="text-start d-none d-md-table-cell">
                Tổ chức
              </th>
              <th class="text-start">
                Trạng thái
              </th>
              <th class="text-start d-none d-md-table-cell">
                Vai trò
              </th>
              <th class="text-start d-none d-md-table-cell">
                TOTP
              </th>
              <th class="text-center">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(user, i) in userList"
              :key="user._id"
            >
              <td class="text-end">
                {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
              </td>
              <td class="text-center d-none d-md-table-cell">
                <img
                  class="rounded-circle avatar object-fit-cover"
                  :src="user.thumbnail ? (user.thumbnail.startsWith('http') ? user.thumbnail : '/' + user.thumbnail) : '/static/images/user_avatar.png'"
                  onerror="this.src = '/static/images/user_avatar.png'"
                />
              </td>
              <td>
                {{ user.username }}
              </td>
              <td>
                {{ user.fullName }}
              </td>
              <td>
                {{ user.email }}
              </td>
              <td>
                {{ user.phone }}
              </td>
              <td class="d-none d-md-table-cell">
                {{ user.org?.name }}
              </td>
              <td>
                <span
                  v-if="user.isActive"
                  class="text-success"
                >
                  Hoạt động
                </span>
                <span
                  v-else
                  class="text-danger"
                >
                  Đã khóa
                </span>
              </td>
              <td class="d-none d-md-table-cell">
                <span
                  v-for="role in user.roleList"
                  :key="role._id"
                  class="badge bg-primary bg-opacity-10 text-primary fw-normal me-2"
                >
                  {{ role.name }}
                </span>
              </td>
              <td class="text-center d-none d-md-table-cell">
                <i
                  v-show="user.totp.enabled"
                  class="bi bi-check text-success"
                ></i>
              </td>
              <td class="text-center">
                <i
                  class="cursor-pointer text-primary bi bi-pencil-square"
                  title="Cập nhật"
                  @click="openForm(user)"
                ></i>

                <i
                  class="cursor-pointer text-primary bi bi-trash ms-3"
                  title="Xóa"
                  @click="deleteRow(user)"
                ></i>
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
    <UsersForm
      ref="frmRef"
      :orgTree="dropdowns.orgTree"
      :roleList="dropdowns.roleList"
      @close="screen = 'list'"
      @updated="search(pagi.currentPage)"
      @inserted="search(1)"
    />
  </div>
</template>


<script setup>
import { convertToTreeData } from '@/helpers/tree.js'
import UsersForm from './UsersForm.vue'
import { debounce } from '@/helpers/common.js'

const filter = reactive({
  text: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const userList = ref([])

const dropdowns = reactive({
  orgTree: [],
  roleList: [],
})

const frmRef = ref()

const screen = ref('list')

const search = async page => {
  const params = {
    text: filter.text.trim(),
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/users/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  userList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const openForm = user => {
  frmRef.value.openForm(user)
  screen.value = 'form'
}

const deleteRow = user => {
  noti.confirm('Bạn có muốn xóa bản ghi?', async () => {
    const { data } = await axios.delete('/api/users/delete/' + user._id)
    if (data.code == 0) {
      noti.success('Xóa bản ghi thành công')
      search(1)
    }
  })
}

const getOrgTree = async () => {
  const { data } = await axios.get('/api/users/get-all-orgs')
  dropdowns.orgTree = convertToTreeData(data)
}

const getRoleList = async () => {
  const { data } = await axios.get('/api/users/get-all-roles')
  dropdowns.roleList = data
}

// Test thôi, xem có hiển thị password không
/*
const getAllUsers = async () => {
  const { data } = await axios.get('/api/users/get-all-users')
  console.log(data)
}
*/

onMounted(() => {
  search(1)
  getOrgTree()
  getRoleList()
  // getAllUsers()
})
</script>


<style scoped>
.avatar {
  width: 1rem;
  height: 1rem;
}
</style>

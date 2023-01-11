<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Log người dùng</li>
    </ol>
  </Teleport>


  <div class="d-flex flex-wrap align-items-center">
    <a-input
      placeholder="IP"
      v-model:value="filter.ip"
      class="form-control-max-width mb-4"
      @input="debouncedSearch()"
    />

    <a-select
      placeholder="Người dùng"
      v-model:value="filter.userId"
      class="form-control-inline-width mb-4 ms-3"
      :options="userList"
      :showSearch="true"
      :allowClear="true"
      :filterOption="filterSelectByLabel"
      @change="search(1)"
    />

    <a-select
      placeholder="Hành động"
      v-model:value="filter.action"
      class="form-control-inline-width mb-4 ms-3"
      :options="actionLogTypes"
      :showSearch="true"
      :allowClear="true"
      :filterOption="filterSelectByLabel"
      @change="search(1)"
    />

    <a-button
      type="danger"
      @click="deleteMany()"
      class="mb-4 ms-auto"
    >
      Xóa
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
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(actionLog, i) in actionLogList"
            :key="actionLog._id"
          >
            <td class="text-end">
              {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
            </td>
            <td>
              {{ actionLog.code }}
            </td>
            <td>
              {{ actionLog.name }}
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
</template>


<script setup>
import { debounce, filterSelectByLabel } from '@/helpers/common.js'

const filter = reactive({
  ip: '',
  userId: '',
  action: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const actionLogList = ref([])

const actionLogTypes = ref([])

const userList = ref([])

const search = async page => {
  const params = {
    /*
    ip: filter.ip.trim(),
    userId: filter.userId,
    action: filter.action,
    */
    ...filter,
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/action-logs/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  actionLogList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const deleteMany = () => {
  const message = 'Bạn có muốn xóa tất cả các bản ghi tìm thấy?'
  const callback = async () => {
    const { data } = await axios.delete('/api/action-logs/delete')
    if (data.code == 0) {
      noti.success('Xóa ' + data.deletedCount + ' bản ghi thành công')
      search(1)
    }
  }
  noti.confirm(message, callback)
}

const getActionLogTypes = async () => {
  const { data } = await axios.get('/api/action-logs/action-log-types')
  actionLogTypes.value = data.map(e => ({
    value: e.id,
    label: e.name,
  }))
}

const getUserList = async () => {
  const { data } = await axios.get('/api/action-logs/get-all-users')
  userList.value = data.map(user => ({
    // key: user._id,
    value: user._id,
    label: user.username,
  }))
}

onMounted(() => {
  search(1)
  getActionLogTypes()
  getUserList()
})
</script>

<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Log người dùng</li>
    </ol>
  </Teleport>


  <div class="d-flex flex-wrap align-items-center">
    <a-select
      placeholder="Hành động"
      v-model:value="filter.action"
      class="form-control-inline-width mb-4 ms-3"
      :options="actionList"
      :showSearch="true"
      :allowClear="true"
      :filterOption="filterSelectByLabel"
      @change="search(1)"
    />

    <a-input
      placeholder="IP"
      v-model:value="filter.ip"
      class="form-control-max-width mb-4 ms-3"
      @input="debouncedSearch()"
    />

    <a-range-picker
      :placeholder="['Từ ngày', 'Đến ngày']"
      v-model:value="filter.range"
      class="form-control-max-width mb-4 ms-3"
      format="DD-MM-YYYY"
      :allowEmpty="[true, true]"
      @change="search(1)"
    />
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
              Hành động
            </th>
            <th>
              IP
            </th>
            <th class="text-center">
              Thời gian
            </th>
            <th>
              Mô tả
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(log, i) in logList"
            :key="log._id"
          >
            <td class="text-end">
              {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
            </td>
            <td>
              {{ log.actionName }}
            </td>
            <td>
              {{ log.ip }}
            </td>
            <td class="text-center">
              {{ formatDateTime(log.createdAt) }}
            </td>
            <td>
              {{ log.description }}
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
import { debounce, filterSelectByLabel, formatDateTime } from '@/helpers/common.js'

const filter = reactive({
  ip: '',
  action: null,
  range: [null, null],
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const logList = ref([])

const actionList = ref([])

const getParams = () => {
  const params = {
    ip: filter.ip.trim(),
    action: filter.action,
  }
  if (filter.range?.[0]) {
    params.createdFrom = filter.range[0]
  }
  if (filter.range?.[1]) {
    params.createdTo = filter.range[1]
  }
  return params
}

const search = async page => {
  const params = getParams()
  params.page = page
  params.size = pagi.size

  const { data } = await axios.post('/api/user-logs/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  logList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const getActionList = async () => {
  const { data } = await axios.get('/api/action-logs/action-list')
  actionList.value = data.map(e => ({
    value: e.id,
    label: e.name,
  }))
}

onMounted(() => {
  search(1)
  getActionList()
})
</script>

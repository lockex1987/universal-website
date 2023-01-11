<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Cấu hình hệ thống</li>
    </ol>
  </Teleport>

  <table class="table table-borderless">
    <thead>
      <tr>
        <th>
          Mã
        </th>
        <th>
          Tên
        </th>
        <th>
          Giá trị
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="config in configList"
        :key="config.code"
      >
        <td>
          {{ config.code }}
        </td>
        <td>
          {{ config.name }}
        </td>
        <td>
          <a-input
            :type="config.type"
            v-model:value.lazy.trim="config.value"
          />
        </td>
      </tr>
    </tbody>
  </table>

  <div>
    <a-button
      type="primary"
      :loading="isSaving"
      @click="saveConfig()"
    >
      Lưu cấu hình
    </a-button>
  </div>
</template>


<script setup>
const configList = ref([])

const isSaving = ref(false)

const saveConfig = async () => {
  isSaving.value = true
  const params = configList.value
  const { data } = await axios.post('/api/system-configs/save-config', params)
  isSaving.value = false
  if (data.code == 0) {
    noti.success('Lưu cấu hình thành công')
  } else if (data.code == 1) {
    noti.error(data.message)
  }
}

const getConfigList = async () => {
  const { data } = await axios.get('/api/system-configs/get-all')
  configList.value = data
}

onMounted(() => {
  getConfigList()
})
</script>

<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item active">Dashboard</li>
    </ol>
  </Teleport>

  <div class="row">
    <div class="col-lg-4 mb-2">
      <div class="h-100 p-4 rounded d-flex align-items-center bg-primary bg-opacity-10 text-primary">
        <i class="font-size-3 me-lg-5 bi bi-person"></i>

        <div>
          <span class="d-block font-size-2">{{ stats.users }}</span>
          <span class="text-uppercase">người dùng</span>
        </div>
      </div>
    </div>

    <div class="col-lg-4 mb-2">
      <div class="h-100 p-4 rounded d-flex align-items-center bg-warning bg-opacity-10 text-warning">
        <i class="font-size-3 me-lg-5 bi bi-shield-check"></i>

        <div>
          <span class="d-block font-size-2">{{ stats.permissions }}</span>
          <span class="text-uppercase">quyền</span>
        </div>
      </div>
    </div>

    <div class="col-lg-4 mb-2">
      <div class="h-100 p-4 rounded d-flex align-items-center bg-success bg-opacity-10 text-success">
        <i class="font-size-3 me-lg-5 bi bi-people"></i>

        <div>
          <span class="d-block font-size-2">{{ stats.roles }}</span>
          <span class="text-uppercase">vai trò</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
const stats = reactive({})

const getStats = async () => {
  const { data } = await axios.get('/api/dashboard/stats')
  Object.assign(stats, data)
}

onMounted(() => {
  getStats()
})
</script>

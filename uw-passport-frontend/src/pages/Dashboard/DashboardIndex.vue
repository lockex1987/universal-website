<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item active">Dashboard</li>
    </ol>
  </Teleport>

  <div class="row">
    <div class="col-lg-6 col-xl-3 mb-2">
      <div class="h-100 p-4 rounded d-flex align-items-center bg-soft-primary text-primary">
        <i class="font-size-3 me-lg-5 la la-user"></i>

        <div>
          <span class="d-block font-size-2">{{ stats.users }}</span>
          <span class="text-uppercase">người dùng</span>
        </div>
      </div>
    </div>


    <div class="col-lg-6 col-xl-3 mb-2">
      <div class="h-100 p-4 rounded d-flex align-items-center bg-soft-warning text-warning">
        <i class="font-size-3 me-lg-5 la la-shield-alt"></i>

        <div>
          <span class="d-block font-size-2">{{ stats.permissions }}</span>
          <span class="text-uppercase">quyền</span>
        </div>
      </div>
    </div>

    <div class="col-lg-6 col-xl-3 mb-2">
      <div class="h-100 p-4 rounded d-flex align-items-center bg-soft-success text-success">
        <i class="font-size-3 me-lg-5 la la-users"></i>

        <div>
          <span class="d-block font-size-2">{{ stats.roles }}</span>
          <span class="text-uppercase">vai trò</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
const stats = reactive({
  /*
  permissions: null,
  roles: null,
  users: null,
  */
})


const getStats = async () => {
  const { data } = await axios.get('/api/dashboard/stats')
  Object.assign(stats, data)
}

onMounted(() => {
  getStats()
})
</script>

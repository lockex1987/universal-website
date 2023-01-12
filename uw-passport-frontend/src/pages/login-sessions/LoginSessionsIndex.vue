<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Phiên đăng nhập</li>
    </ol>
  </Teleport>

  <div v-if="sessionList !== null">
    <div v-if="sessionList.length == 0">
      <a-empty />
    </div>

    <div
      v-else
      class="d-flex flex-wrap"
    >
      <div
        v-for="session in sessionList"
        class="mb-4 me-4 p-4 border rounded"
      >
        <div class="ps-3">
          <div>
            {{ session.key }}
          </div>
          <div class="text-muted">
            {{ session.user }}
          </div>
        </div>

        <a-space>
          <a-button
            type="link"
            @click="deleteFile(session.key)"
          >
            Xóa session
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>


<script setup>
const sessionList = ref(null)

const getSessionList = async () => {
  const { data } = await axios.get('/api/login-sessions/list-sessions')
  sessionList.value = data
}

const deleteFile = async key => {
  const params = {
    key,
  }
  const { data } = await axios.post('/api/login-sessions/delete-session', params)
  if (data.code == 0) {
    noti.success('Xóa session thành công')
    getSessionList()
  }
}

onMounted(() => {
  getSessionList()
})
</script>

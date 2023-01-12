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

    <div v-else>
      <div
        v-for="session in sessionList"
        class="mb-4 p-4 border rounded"
      >
        <div>
          {{ session.user }}
        </div>

        <div>
          <a-button
            type="link"
            class="px-0"
            @click="deleteFile(session.key)"
          >
            Xóa session
          </a-button>
        </div>
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

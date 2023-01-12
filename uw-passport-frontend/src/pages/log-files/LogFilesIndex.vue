<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">File log</li>
    </ol>
  </Teleport>

  <div v-if="fileList !== null">
    <div v-if="fileList.length == 0">
      <a-empty />
    </div>

    <div
      v-else
      class="d-flex flex-wrap"
    >
      <div
        v-for="file in fileList"
        class="mb-4 me-4 p-4 border rounded"
      >
        <div class="ps-3">
          <div>
            {{ file.fileName }}
          </div>
          <div class="text-muted">
            {{ prettyNumber(file.size, 0) }}B
          </div>
        </div>
        <a-space>
          <a-button
            type="link"
            @click="downloadFile(file.fileName)"
          >
            Download
          </a-button>

          <a-button
            type="link"
            @click="clearFile(file.fileName)"
          >
            Xóa nội dung
          </a-button>

          <a-button
            type="link"
            @click="deleteFile(file.fileName)"
          >
            Xóa file
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { prettyNumber } from '@/helpers/common.js'

const fileList = ref(null)

const getFileList = async () => {
  const { data } = await axios.get('/api/log-files/file-list')
  fileList.value = data
}

const downloadFile = async fileName => {
  window.location = '/api/log-files/download-file?fileName=' + encodeURIComponent(fileName)
}

const clearFile = async fileName => {
  const params = {
    fileName,
  }
  const { data } = await axios.post('/api/log-files/clear-file', params)
  if (data.code == 0) {
    noti.success('Xóa nội dung file thành công')
    getFileList()
  }
}

const deleteFile = async fileName => {
  const params = {
    fileName,
  }
  const { data } = await axios.post('/api/log-files/delete-file', params)
  if (data.code == 0) {
    noti.success('Xóa file thành công')
    getFileList()
  }
}

onMounted(() => {
  getFileList()
})
</script>

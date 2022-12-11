<template>
  <div v-show="totp.enabled !== 0">
    <div
      v-show="!totp.enabled"
      class="text-warning"
    >
      Bạn đang không sử dụng TOTP
    </div>

    <!-- TODO: Tự cấu hình? -->

    <div v-show="totp.enabled">
      <canvas
        class="qr-image"
        ref="qrImage"
      ></canvas>
    </div>
  </div>
</template>


<script setup>
import QRious from 'qrious'

const totp = reactive({
  enabled: 0, // chưa xác định, khi xác định sẽ là true hoặc false
  secret: '',
  uri: 'https://github.com/neocotic/qrious',
})

const qrImage = ref()

const initInfo = async () => {
  const { data } = await axios.get('/api/profile/get_totp')
  Object.assign(totp, data)

  if (totp.enabled) {
    new QRious({
      element: qrImage.value,
      value: totp.uri
    })
  }
}

onMounted(() => {
  initInfo()
})
</script>


<style scoped>
.qr-image {
  width: 200px;
  height: 200px;
}
</style>

<template>
  <div v-show="totp.enabled !== 0">
    <div v-show="!totp.enabled">
      <div class="text-warning mb-4">
        Bạn đang không sử dụng TOTP
      </div>

      <div>
        <a-button
          type="primary"
          @click="updateTotp(true)"
        >
          Sử dụng lại
        </a-button>
      </div>
    </div>

    <div v-show="totp.enabled">
      <div class="mb-4">
        <canvas
          class="qr-image"
          ref="qrImage"
        ></canvas>
      </div>

      <div>
        <a-button
          type="primary"
          @click="updateTotp(false)"
        >
          Không sử dụng nữa
        </a-button>
      </div>
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

const getTotp = async () => {
  const { data } = await axios.get('/api/profile/get_totp')
  Object.assign(totp, data)

  if (totp.enabled) {
    new QRious({
      element: qrImage.value,
      value: totp.uri
    })
  }
}

const updateTotp = async totpEnabled => {
  const params = { totpEnabled }
  const { data } = await axios.post('/api/profile/update_totp', params)
  if (data.code == 0) {
    noti.success('Cập nhật thành công')
    getTotp()
  }
}

onMounted(() => {
  getTotp()
})
</script>


<style scoped>
.qr-image {
  width: 200px;
  height: 200px;
}
</style>

<template>
  <div class="row">
    <div class="col-md-8 pe-md-5">
      <h4>
        Giỏ hàng
      </h4>

      <div
        v-if="!displayList.length"
        class="fs-3 text-danger"
      >
        Giỏ hàng rỗng
      </div>

      <div v-else>
        <CartCard
          v-for="(product, idx) in displayList"
          :key="product._id"
          :product="product"
          :isPurchased="isPurchased"
          :class="{ 'border-top': idx > 0 }"
        />

        <div class="text-end fs-4 mb-4">
          Tổng tiền:
          {{ toCurrency(totalMoney) }}
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <h4>
        Thông tin khách hàng
      </h4>

      <div class="text-center">
        <button
          class="btn btn-primary"
          @click="processCheckout()"
          :disabled="displayList.length == 0"
        >
          Thanh toán
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { itemList, clearCart, updateCart } from '@/stores/cart.js'
import { toCurrency } from '@/composables/common.js'
import CartCard from './CartCard.vue'

const purchasedList = ref([])

const isPurchased = ref(false)

const displayList = computed(() => {
  if (isPurchased.value) {
    return purchasedList.value
  }

  return itemList.value
})

const totalMoney = computed(() => {
  let n = 0
  displayList.value.forEach(item => {
    n += item.cost
  })
  return n
})

const processCheckout = async () => {
  const params = {
    itemList: itemList.value,
  }
  const { data } = await axios.post('/api/products/checkout', params)
  const { totalMoneyChanged, list, code, message } = data

  if (totalMoneyChanged) {
    noti.warning('Có thay đổi trong tổng tiền. Vui lòng kiểm tra lại các sản phẩm bạn đã chọn!')
    updateCart(list)
  } else if (code == 0) {
    noti.success('Thanh toán thành công')
    isPurchased.value = true
    purchasedList.value = itemList.value
    clearCart()
  } else if (code == 1) {
    noti.error(message)
  }
}
</script>

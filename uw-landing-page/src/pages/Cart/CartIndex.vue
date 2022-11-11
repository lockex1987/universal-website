<template>
  <main>
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
        @changeItem="getFullList()"
      />

      <div class="text-end fs-4 mb-4">
        Tổng tiền:
        {{ toCurrency(totalMoney) }}
      </div>

      <div class="text-center">
        <!--RouterLink
          to="/checkout"
          class="text-decoration-none fs-3"
        ></RouterLink-->

        <button
          class="btn btn-primary"
          @click="processCheckout()"
        >
          Thanh toán
        </button>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { itemList, clearCart } from '@/stores/cart.js'
import { toCurrency } from '@/composables/common.js'
import CartCard from './CartCard.vue'

const fullList = ref([])

fullList.value = itemList.value

const purchasedList = ref([])

const isPurchased = ref(false)

const totalMoney = computed(() => {
  let n = 0
  fullList.value.forEach(item => {
    n += item.cost
  })
  return n
})

const displayList = computed(() => {
  if (isPurchased.value) {
    return purchasedList.value
  }

  return itemList.value
})

const getFullList = async () => {
  /*
  const params = {
    itemList: itemList.value,
  }
  const { data } = await axios.post('/api/products/get-full-info', params)
  const { list, totalMoneyChanged } = data
  fullList.value = list
  if (totalMoneyChanged) {
    noti.warning('Có thay đổi trong tổng tiền. Vui lòng kiểm tra lại các sản phẩm bạn đã chọn!')
  }
  */
}

const processCheckout = async () => {
  const params = {
    itemList: itemList.value,
  }
  const { data } = await axios.post('/api/products/checkout', params)
  const { totalMoneyChanged, code, message } = data

  if (totalMoneyChanged) {
    noti.warning('Có thay đổi trong tổng tiền. Vui lòng kiểm tra lại các sản phẩm bạn đã chọn!')
  } else if (code == 0) {
    noti.success('Thanh toán thành công')
    isPurchased.value = true
    purchasedList.value = itemList.value
    clearCart()
  } else if (code == 1) {
    noti.error(message)
  }
}

getFullList()
</script>

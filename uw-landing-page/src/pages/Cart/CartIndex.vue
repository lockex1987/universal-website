<template>
  <main>
    <h4>
      Giỏ hàng
    </h4>

    <div
      v-if="!fullList.length"
      class="fs-3 text-danger"
    >
      Giỏ hàng rỗng
    </div>

    <div v-else>
      <CartCard
        v-for="(product, idx) in fullList"
        :key="product._id"
        :product="product"
        :class="{ 'border-top': idx > 0 }"
        @changeItem="getFullList()"
      />

      <div class="text-end fs-4 mb-4">
        Tổng tiền:
        {{ toCurrency(totalMoney) }}
      </div>

      <div class="text-center">
        <RouterLink
          to="/checkout"
          class="text-decoration-none fs-3"
        >
          Thanh toán
        </RouterLink>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { itemList } from '@/stores/cart.js'
import { toCurrency } from '@/composables/common.js'
import CartCard from './CartCard.vue'

const fullList = ref([])

const totalMoney = computed(() => {
  let n = 0
  fullList.value.forEach(item => {
    n += item.cost
  })
  return n
})

const getFullList = async () => {
  const params = {
    itemList: itemList.value,
  }
  const { data } = await axios.post('http://localhost:4000/api/products/get-full-info', params)
  fullList.value = data
}

getFullList()
</script>

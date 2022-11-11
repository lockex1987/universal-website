<template>
  <main>
    <h4>
      Giỏ hàng
    </h4>

    <div
      v-if="!itemList.length"
      class="fs-3 text-danger"
    >
      Giỏ hàng rỗng
    </div>

    <div v-else>
      <CartCard
        v-for="(product, idx) in itemList"
        :key="product._id"
        :product="product"
        :class="{ 'border-top': idx > 0 }"
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

const productList = ref([])

const getProductList = async () => {
  const { data } = await axios.get('http://localhost:4000/api/products/search')
  productList.value = data.list
}

const fullList = computed(() => {
  if (! itemList.value.length || ! productList.value.length) {
    return []
  }

  return itemList.value.map(item => {
    const product = productList.value.find(p => p._id == item._id) ?? {}
    return {
      _id: item._id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
      cost: item.quantity * product.price,
    }
  })
})

const totalMoney = computed(() => {
  let n = 0
  itemList.value.forEach(item => {
    n += item.cost
  })
  return n
})

// getProductList()
</script>

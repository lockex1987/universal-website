<template>
  <div
    v-if="quantityInCart > 0"
    class="btn-group w-100"
  >
    <button
      class="btn btn-light"
      @click="removeFromCart(product._id)"
    >
      -
    </button>

    <button class="btn btn-ghost no-animation">
      {{ quantityInCart }}
    </button>

    <button
      class="btn btn-light"
      @click="addToCart(product._id)"
    >
      +
    </button>
  </div>

  <button
    v-else
    class="btn btn-light w-100"
    @click="addToCart(product._id)"
  >
    Thêm vào giỏ hàng
  </button>
</template>


<script setup>
import { computed } from 'vue'
import { itemList, addToCart, removeFromCart } from '@/stores/cart.js'

const props = defineProps({
  product: Object,
})

const quantityInCart = computed(() => {
  const temp = itemList.value.find(item => item._id == props.product._id)
  return temp?.quantity ?? 0
})
</script>

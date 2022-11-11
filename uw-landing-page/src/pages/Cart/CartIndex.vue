<template>
  <main>
    <h4>
      Giỏ hàng
    </h4>

    <div
      v-if="!formattedCart.length"
      class="fs-3 text-danger"
    >
      Giỏ hàng rỗng
    </div>

    <div v-else>
      <CartCard
        v-for="(cartProduct, idx) in formattedCart"
        :key="idx"
        :cartProduct="cartProduct"
        :class="{ 'border-top': idx > 0 }"
      />

      <div class="text-end fs-4 mb-4">
        Total:
        {{ toCurrency(cartStore.total) }}
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
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import { toCurrency } from '@/composables/common.js'
import CartCard from './CartCard.vue'

const cartStore = useCartStore()

const formattedCart = computed(() => cartStore.formattedCart)
</script>

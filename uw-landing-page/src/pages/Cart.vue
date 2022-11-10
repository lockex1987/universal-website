<template>
  <main>
    <h4>
      Cart
    </h4>

    <div v-if="productStore.loaded">
      <div v-if="!formattedCart.length">
        <div class="fs-3 text-danger">Cart is empty</div>
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
            Checkout
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import CartCard from '@/components/CartCard.vue'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.js'
import { useProductStore } from '@/stores/products.js'
import { toCurrency } from '@/composables/common.js'

const cartStore = useCartStore()
const productStore = useProductStore()
const formattedCart = computed(() => cartStore.formattedCart)
</script>

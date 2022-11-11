<template>
  <div class="py-4 d-flex">
    <img
      :src="product.image"
      alt="Product image"
      class="me-4"
      style="width: 5rem"
    />

    <div>
      <div>
        <RouterLink
          class="text-decoration-none text-body"
          :to="`/product/${product._id}`"
        >
          {{ product.title }}
        </RouterLink>
      </div>

      <div class="mb-3 fw-bold text-muted">
        {{ toCurrency(product.cost) }}
      </div>

      <div>
        <div class="btn-group">
          <button
            class="btn btn-light"
            @click="removeFromCart(product._id)"
          >
            -
          </button>

          <button class="btn btn-ghost no-animation">
            {{ product.quantity }}
          </button>

          <button
            class="btn btn-light"
            @click="addToCart(product._id)"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import { addToCart, removeFromCart } from '@/stores/cart.js'
import { toCurrency } from '@/composables/common.js'

defineProps({
  product: Object,
})
</script>

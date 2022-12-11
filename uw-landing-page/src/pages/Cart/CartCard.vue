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

      <div class="mb-4 fw-bold text-muted">
        {{ toCurrency(product.cost) }}
      </div>

      <div style="max-width: 12rem">
        <!-- Gần giống IsInCart, không cần computed quantityInCart, thêm kiểm tra v-if="!isPurchased" -->
        <div class="btn-group w-100">
          <button
            v-if="!isPurchased"
            class="btn btn-light"
            @click="removeFromCart(product)"
          >
            -
          </button>

          <button class="btn btn-ghost no-animation">
            {{ product.quantity }}
          </button>

          <button
            v-if="!isPurchased"
            class="btn btn-light"
            @click="addToCart(product)"
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
import { toCurrency } from '@/composables/common.js'

defineProps({
  product: Object,
  isPurchased: Boolean,
})
</script>

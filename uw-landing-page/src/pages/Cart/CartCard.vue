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

      <div style="max-width: 12rem">
        <IsInCart
          :product="product"
          @changeItem="$emit('changeItem')"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import { toCurrency } from '@/composables/common.js'
import IsInCart from '@/components/IsInCart.vue'

defineProps({
  product: Object,
})
</script>

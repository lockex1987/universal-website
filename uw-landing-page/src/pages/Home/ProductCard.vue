<template>
  <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
    <div class="card h-100">
      <img
        :src="product.image"
        alt="Product image"
        class="card-img-top mt-3"
        style="height: 12rem; object-fit: contain;"
      />

      <div class="card-body d-flex flex-column">
        <div class="card-title">
          <RouterLink
            class="text-decoration-none text-body"
            :to="`/Product/${product._id}`"
          >
            {{ product.title }}
          </RouterLink>
        </div>

        <div class="card-text mb-4 mt-auto">
          {{ toCurrency(product.price) }}
        </div>

        <div>
          <IsInCart :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import IsInCart from '@/components/IsInCart.vue'
import { toCurrency } from '@/composables/common.js'

defineProps({
  product: Object,
})
</script>

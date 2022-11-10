<template>
  <main>
    <h4>
      Home
    </h4>

    <!-- Product list -->
    <div class="row">
      <ProductCardSkeleton
        v-for="n in 15"
        :key="n"
        v-show="!productStore.loaded"
      />

      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
      />
    </div>
  </main>
</template>


<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'
import { useProductStore } from '@/stores/products.js'

const productStore = useProductStore()

const products = computed(() => productStore.list)
</script>

<template>
  <main>
    <h4>
      Home
    </h4>

    <div class="mb-3">
      Tổng cộng {{ products.length }} sản phẩm
    </div>

    <div class="row">
      <ProductCardSkeleton
        v-for="n in 15"
        :key="n"
        v-show="!productsStore.loaded"
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
import { useProductsStore } from '@/stores/products.js'

const productsStore = useProductsStore()

const products = computed(() => productsStore.list)
</script>

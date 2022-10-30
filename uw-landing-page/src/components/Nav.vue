<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <RouterLink
        to="/"
        class="navbar-brand"
      >
        SeC
      </RouterLink>

      <Search />

      <RouterLink
        to="/cart"
        class=""
      >
        <i class="bi bi-cart fs-5"></i>
        <span class="px-2 bg-primary text-white badge ms-1">
          {{ cartStore.count }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Search from './Search.vue'
import { useCartStore } from '#/stores/cart.js'
// import { computed } from 'vue'

const cartStore = useCartStore()
// const count = computed(() => cartStore.count)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <RouterLink
        to="/"
        class="navbar-brand"
      >
        <img
          src="/static/images/logo.svg"
          class="me-2"
          style="vertical-align: -9px;"
        />
        SeC
      </RouterLink>

      <Search />

      <RouterLink
        to="/cart"
        class="ms-auto"
      >
        <i class="bi bi-cart fs-5"></i>

        <span class="px-2 bg-primary text-white badge ms-1">
          {{ cartStore.itemsCount }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import Search from './Search.vue'

const cartStore = useCartStore()
</script>

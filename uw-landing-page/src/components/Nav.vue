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
        to="/Cart"
        class="ms-auto"
      >
        <i class="bi bi-cart fs-5"></i>

        <span class="px-2 bg-primary text-white badge ms-1">
          {{ itemsCount }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import { itemsCount } from '@/stores/cart.js'
import Search from './Search.vue'
</script>

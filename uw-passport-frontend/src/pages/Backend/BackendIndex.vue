<template>
  <Nav />

  <div class="p-3">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Nav from './components/Nav.vue'
</script>

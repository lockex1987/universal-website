<template>
  <Nav />

  <div class="container py-3">
    <RouterView />
  </div>
</template>


<script setup>
import { RouterView } from 'vue-router'
import Nav from '@/components/Nav.vue'
</script>

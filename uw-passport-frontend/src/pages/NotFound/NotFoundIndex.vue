<template>
  <div
    class="mx-auto mt-5"
    style="max-width: 500px"
  >
    <h4>
      Not found
    </h4>

    <div>
      <RouterLink :to="{ name: 'Home' }">
        Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

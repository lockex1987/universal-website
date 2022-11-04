<template>
  <TopHeader />

  <div class="d-flex w-100">
    <div
      class="flex-shrink-0"
      style="width: 300px"
    >
      <LeftNav />
    </div>

    <div class="p-3 flex-grow-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import TopHeader from './TopHeader.vue'
import LeftNav from './LeftNav.vue'
</script>

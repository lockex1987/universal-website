<template>
  <TopHeader />

  <div class="d-lg-flex w-100">
    <OffcanvasLeftSidebar class="flex-shrink-0 main-content-height overflow-auto" />

    <div class="p-3 flex-grow-1 main-content-height overflow-auto">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import TopHeader from './TopHeader.vue'
import OffcanvasLeftSidebar from './OffcanvasLeftSidebar.vue'
</script>

<style>
@media (min-width: 992px) {
  .main-content-height {
    height: calc(100vh - 70px);
  }

  #offcanvasLeftSidebar {
    width: 300px;
  }
}
</style>

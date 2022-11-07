<template>
  <TopHeader />

  <div class="d-lg-flex w-100">
    <OffcanvasLeftSidebar class="flex-shrink-0" />

    <div class="p-3 flex-grow-1 main-content overflow-auto">
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
  #offcanvasLeftSidebar {
    width: 300px;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    height: calc(100vh - 70px);
  }

  .main-content {
    height: calc(100vh - 70px);
  }
}
</style>

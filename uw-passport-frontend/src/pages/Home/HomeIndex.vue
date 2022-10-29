<template>
  <div>
    Home 2
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

// const authStore = useAuthStore()
const router = useRouter()

/*
onMounted(() => {
  const user = authStore.user
  if (!user.id) {
    router.push({ name: 'login' })
  } else {
    router.push({ name: 'dashboard' })
  }
})
*/
</script>

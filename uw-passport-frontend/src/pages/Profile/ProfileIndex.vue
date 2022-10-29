<template>
  <main>
    <h4>
      Profile
    </h4>

    <pre>
      {{ authStore.user }}
    </pre>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
</script>

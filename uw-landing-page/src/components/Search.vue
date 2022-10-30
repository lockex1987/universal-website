<template>
  <div
    class="dropdown"
    style="width: 24rem"
  >
    <input
      type="text"
      placeholder="Search..."
      class="form-control"
      :disabled="!productStore.loaded"
      v-model.trim="input"
      data-bs-toggle="dropdown"
    />

    <ul
      class="dropdown-menu overflow-auto w-100"
      style="max-height: 50vh"
    >
      <li
        v-for="product in searchResults"
        :key="product.id"
      >
        <a
          href="#"
          @click.prevent="navigate(product.id)"
          class="dropdown-item text-truncate"
        >
          {{ product.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products.js'

const productStore = useProductStore()
const router = useRouter()
const input = ref('')

const searchResults = computed(() => {
  if (! input.value || input.value.length < 2) {
    return []
  }

  const temp = input.value.toLowerCase()
  return productStore.list.filter(product => product.title.toLowerCase().includes(temp))
})

const navigate = id => {
  input.value = ''
  router.push(`/product/${id}`)
}
</script>

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
      v-model.trim="searchText"
      data-bs-toggle="dropdown"
    />

    <ul
      class="dropdown-menu overflow-auto w-100"
      style="max-height: 50vh"
    >
      <li
        v-for="product in searchResults"
        :key="product._id"
      >
        <a
          href="#"
          @click.prevent="gotoProductPage(product._id)"
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

const router = useRouter()

const productStore = useProductStore()

const searchText = ref('')

const searchResults = computed(() => {
  if (! searchText.value || searchText.value.length < 2) {
    return []
  }

  const temp = searchText.value.toLowerCase()
  return productStore.list.filter(product => product.title.toLowerCase().includes(temp))
})

const gotoProductPage = _id => {
  searchText.value = ''
  router.push(`/product/${_id}`)
}
</script>

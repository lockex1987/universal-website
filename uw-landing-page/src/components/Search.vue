<template>
  <div
    class="dropdown"
    style="width: 24rem"
  >
    <input
      type="text"
      placeholder="Tìm kiếm..."
      class="form-control"
      v-model.trim="searchText"
      @focus="showSearchResults = true"
      @blur="closeSearchResults()"
    />

    <ul
      v-show="showSearchResults"
      class="dropdown-menu show overflow-auto w-100"
      style="max-height: 50vh"
    >
      <li
        v-for="product in searchResults"
        :key="product._id"
      >
        <a
          href="#"
          @click.prevent="gotoProductPage(product._id)"
          class="dropdown-item text-truncate py-2"
        >
          <img
            :src="product.image"
            alt="Product image"
            class="me-2"
            style="height: 2rem; object-fit: contain;"
          />
          {{ product.title }}
        </a>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const searchText = ref('')

const showSearchResults = ref(false)

const productList = ref([])

const searchResults = computed(() => {
  if (! searchText.value || searchText.value.length < 2) {
    return []
  }

  const temp = searchText.value.toLowerCase()
  return productList.value.filter(product => product.title.toLowerCase().includes(temp))
})

const getProductList = async () => {
  const { data } = await axios.get('http://localhost:4000/api/products/search')
  productList.value = data.list
}

const gotoProductPage = _id => {
  searchText.value = ''
  router.push(`/Product/${_id}`)
}

const closeSearchResults = () => {
  // Phải thêm đoạn này nếu không sẽ bị ẩn luôn
  // và sẽ không bắt được sự kiện khi click vào các sản phẩm
  setTimeout(() => {
    showSearchResults.value = false
  }, 500)
}

onMounted(() => {
  getProductList()
})
</script>

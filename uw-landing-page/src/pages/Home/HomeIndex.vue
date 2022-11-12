<template>
  <main>
    <!--h4>
      Trang chủ
    </h4-->

    <div class="mb-3">
      Tổng cộng {{ productList.length }} sản phẩm
    </div>

    <div class="row">
      <ProductCard
        v-for="product in productList"
        :key="product._id"
        :product="product"
      />
    </div>
  </main>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from './ProductCard.vue'

const productList = ref([])

const getProductList = async () => {
  const { data } = await axios.get('http://localhost:4000/api/products/search')
  productList.value = data.list
}

onMounted(() => {
  getProductList()
})
</script>

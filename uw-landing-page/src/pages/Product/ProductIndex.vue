<template>
  <div class="pt-5">
    <!--h4 class="mb-5">
      Chi tiết sản phẩm
    </h4-->


    <div v-if="product">
      <div class="row">
        <div class="col-md-6">
          <img
            :src="product.image"
            alt="Product image"
            class="w-100 mb-5 mb-md-0"
            style="height: 25rem; object-fit: contain;"
          />
        </div>

        <div class="col-md-6">
          <div class="fs-3 mb-3">
            {{ product.title }}
          </div>

          <div class="mb-3 text-muted">
            {{ product.description }}
          </div>

          <div
            class="mb-3 text-muted"
            v-html="product.content"
          ></div>

          <div class="mb-3 fw-bolder">
            {{ toCurrency(product.price) }}
          </div>

          <div style="max-width: 12rem">
            <IsInCart :product="product" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="noProduct"
      class="fs-3 text-danger"
    >
      Không tìm thấy sản phẩm với ID {{ route.params._id }}
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import IsInCart from '@/components/IsInCart.vue'
import { toCurrency } from '@/composables/common.js'

const route = useRoute()

const product = reactive({})

const noProduct = ref(false)

const getProduct = async () => {
  const _id = route.params._id
  const url = 'http://localhost:4000/api/products/detail/' + _id
  const { data } = await axios.get(url)
  if (data._id) {
    Object.assign(product, data)
  } else {
    noProduct.value = true
  }
}

getProduct()

// Watch đường dẫn thay đổi,
// khi đang xem chi tiết sản phẩm A thì search ở header và vào lại sản phẩm B
watch(route, newValue => {
  // Chỉ khi vào lại route này
  if (newValue.name == 'Product') {
    getProduct()
  }
})
</script>

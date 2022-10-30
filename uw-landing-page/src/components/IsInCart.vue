<template>
  <div
    v-if="quantityInCart > 0"
    class="btn-group w-100"
  >
    <button
      class="btn btn-light"
      @click="cartStore.remove(product.id)"
    >
      -
    </button>

    <button class="btn btn-ghost no-animation">
      {{ quantityInCart }}
    </button>

    <button
      class="btn btn-light"
      @click="cartStore.add(product.id)"
    >
      +
    </button>
  </div>

  <button
    v-else
    class="btn btn-light w-100"
    @click="cartStore.add(product.id)"
  >
    Add to Cart
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.js'

const props = defineProps({
  product: Object,
})

const cartStore = useCartStore()

const quantityInCart = computed(() => {
  const temp = cartStore.contents[props.product.id]
  return temp?.quantity ?? 0
})
</script>

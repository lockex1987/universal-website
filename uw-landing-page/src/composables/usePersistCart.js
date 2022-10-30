import { useCartStore } from '#/stores/cart.js'
// import { onUnmounted } from 'vue'

export const CART_STORAGE = 'CART_STORAGE'

export const usePersistCart = () => {
  const cartStore = useCartStore()

  const unsub = cartStore.$subscribe((mutation, state) => {
    // console.log(state)
    // console.log(cartStore.contents)
    localStorage.setItem(CART_STORAGE, JSON.stringify(cartStore.contents))
  })

  // Not neccessary?
  /*
  onUnmounted(() => {
    unsub()
  })
  */
}

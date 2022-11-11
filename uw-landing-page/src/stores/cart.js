import { ref, computed } from 'vue'

const CART_STORAGE = 'CART_STORAGE'

export const itemList = ref(JSON.parse(localStorage.getItem(CART_STORAGE)) ?? [])

const saveItemList = () => {
  localStorage.setItem(CART_STORAGE, JSON.stringify(itemList.value))
}

export const itemsCount = computed(() => {
  let count = 0
  itemList.value.forEach(item => {
    count += item.quantity
  })
  return count
})

export const addToCart = productId => {
  const existingItem = itemList.value.find(item => item.productId === productId)
  if (! existingItem) {
    itemList.value.push({ productId, quantity: 1 })
  } else {
    existingItem.quantity++
  }
  saveItemList()
}

export const removeFromCart = productId => {
  const i = itemList.value.findIndex(item => item.productId == productId)
  if (i >= 0) {
    const item = itemList.value[i]
    item.quantity--
    if (item.quantity <= 0) {
      itemList.value.splice(i, 1)
    }
    saveItemList()
  }
}

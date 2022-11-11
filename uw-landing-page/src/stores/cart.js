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

export const addToCart = product => {
  const item = itemList.value.find(e => e._id === product._id)
  if (! item) {
    itemList.value.push({
      _id: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: 1,
      cost: product.price,
    })
  } else {
    item.quantity++
    item.cost = item.quantity * item.price
  }
  saveItemList()
}

export const removeFromCart = product => {
  const i = itemList.value.findIndex(e => e._id == product._id)
  if (i >= 0) {
    const item = itemList.value[i]
    item.quantity--
    item.cost = item.quantity * item.price
    if (item.quantity <= 0) {
      itemList.value.splice(i, 1)
    }
    saveItemList()
  }
}

export const clearCart = () => {
  itemList.value = []
  saveItemList()
}

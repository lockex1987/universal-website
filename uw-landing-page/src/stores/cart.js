import { defineStore } from 'pinia'
import { CART_STORAGE } from '@/composables/usePersistCart.js'
import { useProductStore } from './products.js'

export const useCartStore = defineStore({
  id: 'cart',

  state: () => ({
    contents: JSON.parse(localStorage.getItem(CART_STORAGE)) ?? {},
  }),

  getters: {
    count() {
      return Object.keys(this.contents).reduce((acc, id) => {
        return acc + this.contents[id].quantity
      }, 0)
    },

    total() {
      const products = useProductStore()
      return Object.keys(this.contents).reduce((acc, id) => {
        return acc + products.items[id].price * this.contents[id].quantity
      }, 0)
    },

    formattedCart() {
      const products = useProductStore()

      if (!products.loaded) {
        return []
      }

      return Object.keys(this.contents).map(productId => {
        const purchase = this.contents[productId]

        return {
          id: purchase.productId,
          image: products.items[purchase.productId].image,
          title: products.items[purchase.productId].title,
          quantity: purchase.quantity,
          cost: purchase.quantity * products.items[purchase.productId].price,
        }
      })
    },
  },

  actions: {
    add(productId) {
      if (this.contents[productId]) {
        this.contents[productId].quantity += 1
      } else {
        this.contents[productId] = {
          productId,
          quantity: 1,
        }
      }
    },

    remove(productId) {
      if (!this.contents[productId]) {
        return
      }

      this.contents[productId].quantity -= 1

      if (this.contents[productId].quantity === 0) {
        delete this.contents[productId]
      }
    },
  },
})

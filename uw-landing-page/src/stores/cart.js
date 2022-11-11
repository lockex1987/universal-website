import { defineStore } from 'pinia'
import axios from 'axios'

export const CART_STORAGE = 'CART_STORAGE'

export const useCartStore = defineStore('cart', {
  state: () => ({
    contents: JSON.parse(localStorage.getItem(CART_STORAGE)) ?? {},

    items: {},

    ids: [],
  }),

  getters: {
    itemsCount() {
      let count = 0
      Object.keys(this.contents).forEach(id => {
        count += this.contents[id].quantity
      })
      return count
    },

    total() {
      return Object.keys(this.contents).reduce((acc, id) => {
        return acc + this.items[id].price * this.contents[id].quantity
      }, 0)
    },

    formattedCart() {
      if (! this.loaded) {
        return []
      }

      return Object.keys(this.contents).map(productId => {
        const purchase = this.contents[productId]

        return {
          id: purchase.productId,
          image: this.items[purchase.productId].image,
          title: this.items[purchase.productId].title,
          quantity: purchase.quantity,
          cost: purchase.quantity * this.items[purchase.productId].price,
        }
      })
    },

    list: state => state.ids.map(_id => state.items[_id]),

    loaded() {
      return this.ids.length > 0
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

      localStorage.setItem(CART_STORAGE, JSON.stringify(this.contents))
    },

    remove(productId) {
      if (! this.contents[productId]) {
        return
      }

      this.contents[productId].quantity -= 1

      if (this.contents[productId].quantity === 0) {
        delete this.contents[productId]
      }

      localStorage.setItem(CART_STORAGE, JSON.stringify(this.contents))
    },

    async getAll() {
      if (this.loaded) {
        return
      }

      const { data } = await axios.get('http://localhost:4000/api/products/search')
      this.ids = data.list.map(product => {
        this.items[product._id] = product
        return product._id
      })
    },
  },
})

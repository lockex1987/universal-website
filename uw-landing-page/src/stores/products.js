import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore({
  id: 'products',

  state: () => ({
    items: {},
    ids: [],
  }),

  getters: {
    list: state => state.ids.map(id => state.items[id]),

    loaded() {
      return this.ids.length > 0
    },
  },

  actions: {
    async getAll() {
      if (this.loaded) {
        return
      }

      const { data } = await axios.get('http://localhost:4000/api/products/search')
      this.ids = data.list.map(product => {
        this.items[product.id] = product
        return product.id
      })
    },
  },
})

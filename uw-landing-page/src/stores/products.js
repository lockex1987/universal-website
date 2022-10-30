import { defineStore } from 'pinia'
import axios from 'axios'

const fakeStoreUrl = 'https://fakestoreapi.com'

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
      const resp = await axios.get(`${fakeStoreUrl}/products`)
      const data = resp.data
      this.ids = data.map(product => {
        this.items[product.id] = product
        return product.id
      })
    },
  },
})

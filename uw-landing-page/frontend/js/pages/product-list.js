import {
  getItems,
  increaseQuantity,
  getFullCartItems,
} from '~/helpers/shopping-cart.js'

Vue.createApp({
  mounted() {
    this.bindProductQuantity()

    PubSub.subscribe('cart-items-changed', () => {
      this.bindProductQuantity()
    })
  },

  methods: {
    bindProductQuantity() {
      const items = getItems()
      document.querySelectorAll('.product-quantity').forEach(spanTag => {
        const productId = parseInt(spanTag.dataset.productId)
        const obj = items.find(e => e.id == productId)
        if (obj) {
          spanTag.textContent = obj.quantity
        } else {
          spanTag.textContent = ''
        }
      })
    },

    addToCartVue(productId) {
      const items = increaseQuantity(productId)
      const obj = items.find(e => e.id == productId)
      const spanTag = document.querySelector('#productQuantity' + productId)
      spanTag.textContent = obj.quantity

      getFullCartItems(items)
    },
  },
}).mount('#app')


Carousel.makeInfinite(document.querySelector('.nat-carousel-inner'))

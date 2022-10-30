import {
  getItems,
  removeFromCart,
  getFullCartItems,
} from '~/helpers/shopping-cart.js'

// Gọi ở order.js và header-cart.js
import mixin from '~/mixin/index.js'

Vue.createApp({
  mixins: [
    mixin,
  ],

  data() {
    return {
      // Danh sách các sản phẩm trong giỏ hàng
      cartItems: [],

      // Tổng số tiền
      total: null,
    }
  },

  computed: {
    /**
     * Tổng số lượng.
     */
    totalQuantity() {
      let n = 0
      this.cartItems.forEach(item => {
        n += item.quantity
      })
      return n
    },
  },

  mounted() {
    PubSub.subscribe('cart-items-changed', data => {
      this.cartItems = data.fullInfo
      this.total = data.total
    })

    // Lấy dữ liệu từ localStorage
    const items = getItems()
    getFullCartItems(items)
  },

  methods: {
    /**
     * Xóa sản phẩm khỏi giỏ hàng.
     */
    removeItem(item) {
      const items = removeFromCart(item.id)
      getFullCartItems(items)
    },
  },
}).mount('#headerCart')

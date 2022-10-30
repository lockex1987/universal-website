import {
  getItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearItems,
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

      // Thông tin khách hàng
      customer: {
        name: '',
        gender: 1, // 1: nam, 2: nữ
        email: '',
        address: '',
        phone: '',
        note: '',
        payment: '',
      },

      // Đang lưu thông tin
      isSaving: false,

      // Đã đặt hàng thành công
      orderSuccess: false,
    }
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

    /**
     * Tăng số lượng.
     */
    plusQuantity(item) {
      const items = increaseQuantity(item.id)
      getFullCartItems(items)
    },

    /**
     * Giảm số lượng.
     */
    minusQuantity(item) {
      const items = decreaseQuantity(item.id)
      getFullCartItems(items)
    },

    /**
     * Thực hiện đặt hàng.
     */
    async processOrder() {
      if (this.isSaving) {
        return
      }

      if (CV.invalidForm(this.$el)) {
        return
      }

      const items = getItems()
      if (items.length == 0) {
        noti.error('Bạn chưa chọn sản phẩm nào')
        return
      }

      this.isSaving = true
      const params = {
        items: items,
        customer: this.customer,
      }
      const { data } = await axios.post('/dat-hang', params)
      this.isSaving = false

      if (data.code == 0) {
        noti.success('Bạn đã đặt hàng thành công')
        clearItems()
        this.cartItems = data.fullInfo
        this.total = data.total
        this.orderSuccess = true
      }
    },
  },
}).mount('#app')

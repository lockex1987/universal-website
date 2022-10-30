const LOCAL_STORAGE_NAME = 'shopping-cart'

/**
 * Lấy danh sách các sản phẩm trong giỏ hàng hiện tại.
 * @return {Array} Mảng các sản phẩm, gồm có { id, quantity }
 */
function getItems() {
  const str = localStorage.getItem(LOCAL_STORAGE_NAME)
  if (str) {
    return JSON.parse(str)
  }
  return []
}

/**
 * Xóa tất cả các sản phẩm trong giỏ hàng.
 * @return {Array} Một mảng rỗng
 */
function clearItems() {
  localStorage.removeItem(LOCAL_STORAGE_NAME)
  return []
}

/**
 * Tăng số lượng sản phẩm ở giỏ hàng.
 * @param {Integer} productId ID sản phẩm
 * @return {Array} Mảng các sản phẩm
 */
function increaseQuantity(productId) {
  const items = getItems()
  const obj = items.find(e => e.id == productId)
  if (obj) {
    obj.quantity++
  } else {
    items.push({
      id: productId,
      quantity: 1,
    })
  }
  localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(items))
  return items
}

/**
 * Giảm số lượng sản phẩm ở giỏ hàng.
 * @param {Integer} productId ID sản phẩm
 * @return {Array} Mảng các sản phẩm
 */
function decreaseQuantity(productId) {
  const items = getItems()
  const idx = items.findIndex(e => e.id == productId)
  if (idx >= 0) {
    const obj = items[idx]
    obj.quantity--
    if (obj.quantity <= 0) {
      items.splice(idx, 1)
    }
  }
  localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(items))
  return items
}

/**
 * Xóa sản phẩm khỏi giỏ hàng.
 * @param {Integer} productId ID sản phẩm
 * @return {Array} Mảng các sản phẩm
 */
function removeFromCart(productId) {
  const items = getItems()
  const idx = items.findIndex(e => e.id == productId)
  if (idx >= 0) {
    items.splice(idx, 1)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(items))
  }
  return items
}

/**
 * Lấy full thông tin các sản phẩm trong giỏ hàng.
 */
async function getFullCartItems(items) {
  if (!items || items.length == 0) {
    PubSub.publish('cart-items-changed', { total: 0, fullInfo: [] })
    return
  }

  const params = {
    items: items,
  }
  const { data } = await axios.post('/full-cart-items', params)
  PubSub.publish('cart-items-changed', data)
}

export {
  getItems,
  clearItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  getFullCartItems,
}

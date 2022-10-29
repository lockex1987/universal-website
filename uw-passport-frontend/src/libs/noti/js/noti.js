const noti = (() => {
  // Tùy chọn mặc định
  const DEFAULT_OPTIONS = {
    // CSS class, quy định màu sắc
    cssClass: '',

    // CSS class của icon hiển thị trước nội dung alert (Line Awesome)
    icon: '',

    // thời gian hiển thị thông báo, tính bằng ms, mặc định 5 giây
    duration: 5000,

    // tự động đóng thông báo
    autoClose: true,
  }

  /**
   * Lấy vùng chứa các thông báo.
   * @return {Element} Container
   */
  function getNotiContainer() {
    // Vùng chứa là một vùng div có ID là noti và class là .noti
    let notiContainer = document.querySelector('#noti')

    // Nếu chưa có thì thêm vào trong trang
    if (notiContainer == null) {
      notiContainer = document.createElement('div')
      notiContainer.className = 'noti position-fixed top-0 end-0 mt-2 me-3'
      notiContainer.id = 'noti'
      document.body.appendChild(notiContainer)
    }

    return notiContainer
  }

  /**
   * Hàm chung.
   * @param {String} text Nội dung thông báo
   * @param {Object} options Tùy chọn
   */
  function notify(text, options = {}) {
    // Kết hợp tùy chọn mặc định và tùy chọn của người dùng
    options = Object.assign({}, DEFAULT_OPTIONS, options)

    const alertTag = createAlertTag(text, options)

    // Thêm thông báo vào trang
    const notiContainer = getNotiContainer()
    notiContainer.appendChild(alertTag)

    // Tự động đóng thông báo sau khoảng thời gian cho trước
    if (options.autoClose) {
      setTimeout(() => {
        closeNotification(alertTag)
      }, options.duration)
    }
  }

  /**
   * Tạo đối tượng DOMNode thông báo.
   * @param {String} text Nội dung thông báo
   * @param {Object} options Tùy chọn
   * @return {Element} Alert tag
   */
  function createAlertTag(text, options) {
    // Nội dung thông báo
    const alertTag = document.createElement('div')
    alertTag.className = 'p-3 rounded shadow-lg mt-2 d-flex align-items-start alert ' + options.cssClass

    // Icon
    if (options.icon) {
      const iconMarkup = document.createElement('i')
      iconMarkup.className = options.icon + ' me-3'
      alertTag.appendChild(iconMarkup)
    }

    // Text
    const textSpan = document.createElement('div')
    textSpan.innerHTML = text
    alertTag.appendChild(textSpan)

    // Khi click vào thì đóng thông báo
    alertTag.addEventListener('click', () => {
      closeNotification(alertTag)
    })

    return alertTag
  }

  /**
   * Xóa thông báo cũ.
   * @param {DOMNode} element Đối tượng thông báo
   */
  function closeNotification(element) {
    element.classList.add('fade-out')
    setTimeout(() => {
      // Chú ý, có trường hợp người dùng đã chủ động xóa (bằng cách click vào thông báo)
      // nên khi tự động xóa bằng timeout sẽ bị lỗi
      const parentNode = element.parentNode
      if (parentNode) {
        parentNode.removeChild(element)
      }
    }, 500)
  }

  /**
   * Hàm chung (nữa).
   * @param {String} text Nội dung thông báo
   * @param {Object} defaultOptionsOfType Tùy chọn mặc định có từng loại (error, success, info, warning)
   * @param {Object} options Tùy chọn của người dùng
   */
  function notifyWithDefault(text, defaultOptionsOfType, options = {}) {
    options = Object.assign({}, defaultOptionsOfType, options)
    notify(text, options)
  }

  /**
   * Thông báo lỗi.
   * @param {String} text Content
   * @param {Object} options Config
   */
  function displayError(text, options) {
    notifyWithDefault(text, {
      cssClass: 'bg-danger text-white',
      icon: 'bi bi-exclamation-circle',
    }, options) // , autoClose: false
  }

  /**
   * Thông báo thành công.
   * @param {String} text Content
   * @param {Object} options Config
   */
  function displaySuccess(text, options) {
    notifyWithDefault(text, {
      cssClass: 'bg-success text-white',
      icon: 'bi bi-check-lg',
    }, options)
  }

  /**
   * Thông báo.
   * @param {String} text Content
   * @param {Object} options Config
   */
  function displayInfo(text, options) {
    notifyWithDefault(text, {
      cssClass: 'bg-primary text-white',
      icon: 'bi bi-info-circle',
    }, options)
  }

  /**
   * Cảnh báo.
   * @param {String} text Content
   * @param {Object} options Config
   */
  function displayWarning(text, options) {
    notifyWithDefault(text, {
      cssClass: 'bg-warning text-white',
      icon: 'bi bi-exclamation-triangle',
    }, options)
  }

  /**
   * Xác nhận.
   * @param {String} text Nội dung xác nhận (mã HTML)
   * @param {Function} acceptCallback Hàm gọi khi người dùng đồng ý
   * @param {Function} rejectCallback Hàm gọi khi người dùng không đồng ý
   */
  function displayConfirm(text, acceptCallback, rejectCallback) {
    // Vùng chứa confirm
    const confirmContainer = document.createElement('div')
    confirmContainer.className = 'noti-confirm position-fixed'
    confirmContainer.innerHTML = `
      <div class="confirm-dialog shadow-lg rounded">
        <div class="confirm-message text-break text-start font-size-1.25 p-4">
          ${text}
        </div>

        <div class="confirm-buttons text-end p-3">
          <button class="button accept btn btn-primary">
            Đồng ý
          </button>

          <button class="button reject btn btn-outline-primary ms-3">
            Đóng
          </button>
        </div>
      </div>`

    // Ẩn confirm
    const hideConfirm = () => {
      confirmContainer.parentNode.removeChild(confirmContainer)
    }

    // Click đồng ý
    confirmContainer.querySelector('.accept').addEventListener('click', () => {
      hideConfirm()
      acceptCallback()
    })

    // Click đóng
    confirmContainer.querySelector('.reject').addEventListener('click', () => {
      hideConfirm()
      if (rejectCallback) {
        rejectCallback()
      }
    })

    // Click ở bên trong thì dừng lại
    confirmContainer.querySelector('.confirm-dialog').addEventListener('click', evt => {
      evt.stopPropagation()
    })

    // Click ra ngoài thì đóng
    confirmContainer.addEventListener('click', () => {
      hideConfirm()
      if (rejectCallback) {
        rejectCallback()
      }
    })

    // Hiển thị
    document.body.appendChild(confirmContainer)
  }

  return {
    error: displayError,
    success: displaySuccess,
    info: displayInfo,
    warning: displayWarning,
    confirm: displayConfirm,
  }
})()

window.noti = noti

/**
 * Animation khi scroll.
 */
function initAnimationOnScroll() {
  AOS.init({
    // duration: 800,
    // easing: 'slide',
    // once: true
  })
}


/**
 * Khởi tạo partical animation.
 */
function initParticleAnimation() {
  new JParticles.Particle('#particleGround', {
    color: 'rgba(255, 255, 255, 0.5)',
    num: 0.1,
    minR: 0.1,
    maxR: 1,
    maxSpeed: 1,
    minSpeed: 0.3,
    // proximity: 90,
    // range: 100
  })
}


/**
 * Animate counting number.
 * @param {Integer} number Con số cuối cùng
 * @param {Integer} duration Khoảng thời gian animation, tính theo milli giây
 */
function animateCountingNumber(spanDiv, number, duration = 2000) {
  // Thời điểm đánh dấu bắt đầu animation
  let startTime = 0

  /**
   * Hàm ease.
   * Tham số đầu vào là một số, khoảng thời gian đã trôi qua, trong khoảng 0 -> 1.
   * Trả về khoảng cách tương ứng, trong khoảng từ 0 -> 1.
   */
  const easeFunction = x => {
    // easeOutExpo
    // return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

    // linear
    return x
  }

  /**
   * Thực hiện animation.
   */
  const animateNumber = () => {
    startTime = performance.now()
    requestAnimationFrame(updateNumber)
  }

  /**
   * Hàm gọi mỗi frame khi animation.
   */
  const updateNumber = currentTime => {
    const elapsedTime = currentTime - startTime
    if (elapsedTime >= duration) {
      // Đã kết thúc
      callback(number)
    } else {
      // Tính toán số hiện tại
      const timeRate = (1.0 * elapsedTime) / duration
      const numberRate = easeFunction(timeRate)
      const currentNumber = Math.floor(numberRate * number)
      callback(currentNumber)

      // Thực hiện tiếp animation
      requestAnimationFrame(updateNumber)
    }
  }

  /**
   * Cập nhật giá trị hiện tại.
   */
  const callback = currentNumber => {
    spanDiv.textContent = currentNumber
  }

  animateNumber()
}


initAnimationOnScroll()
initParticleAnimation()
animateCountingNumber(document.querySelector('#countingNumber2'), 250)
animateCountingNumber(document.querySelector('#countingNumber1'), 90)
Carousel.makeInfinite(document.querySelector('.nat-carousel-inner'))

/**
 * Xử lý sticky header khi scroll.
 */
function checkStickyHeader() {
  const st = $(window).scrollTop()
  if (st > 60) {
    $('.site-navbar').addClass('shrink')
  } else {
    $('.site-navbar').removeClass('shrink')
  }
}

$(window).on('scroll', checkStickyHeader)

checkStickyHeader()

(function () {
    // Các CSS class
    const NAT_CAROUSEL_CLASS = 'nat-carousel';
    const NAT_CAROUSEL_INNER_CLASS = 'nat-carousel-inner';

    // Đánh dấu đang được drag
    const draggedMark = {
        // Phần tử .carousel-inner
        carouselInner: null,

        // Vị trí x bắt đầu khi drag
        startXCoord: 0,

        // Chiều rộng của từng phần tử
        itemWidth: 0,

        // Chỉ số phần tử đầu tiên bên trái
        startIndex: 0
    };

    /**
     * Lấy vị trí x.
     * Thống nhất sự kiện touch và mouse.
     * @param {Event} evt Sự kiện
     */
    function getXCoord(evt) {
        const e = evt.changedTouches ? evt.changedTouches[0] : evt;
        return e.clientX;
    }

    /**
     * Xử lý bắt đầu drag.
     * @param {Event} evt Sự kiện
     */
    function startDrag(evt) {
        const carouselInner = evt.target.closest('.' + NAT_CAROUSEL_INNER_CLASS);
        if (carouselInner) {
            carouselInner.classList.add('no-transition');

            draggedMark.carouselInner = carouselInner;
            draggedMark.startXCoord = getXCoord(evt);
            draggedMark.itemWidth = calculateItemWidth(carouselInner);
            draggedMark.startIndex = getStartIndex(carouselInner);
        }
    }

    /**
     * Xử lý đang drag.
     * @param {Event} evt Sự kiện
     */
    function handleDrag(evt) {
        const carouselInner = draggedMark.carouselInner;
        if (carouselInner) {
            // Thêm preventDefault để không bị scroll dọc khi drag
            evt.preventDefault();

            const draggedPixel = Math.round(getXCoord(evt) - draggedMark.startXCoord);
            let x = draggedMark.startIndex * draggedMark.itemWidth - draggedPixel;
            if (carouselInner.dataset.isInfinite) {
                x += draggedMark.itemWidth;
            }
            carouselInner.style.transform = `translateX(${-x}px)`;
        }
    }

    /**
     * Xử lý kết thúc drag.
     * @param {Event} evt Sự kiện
     */
    function finishDrag(evt) {
        const carouselInner = draggedMark.carouselInner;
        if (!carouselInner) {
            return;
        }

        carouselInner.classList.remove('no-transition');
        const itemWidth = draggedMark.itemWidth;
        const deltaX = getXCoord(evt) - draggedMark.startXCoord;
        let newStartIndex;
        if (Math.abs(deltaX) <= 30) {
            newStartIndex = draggedMark.startIndex;
        } else {
            newStartIndex = draggedMark.startIndex - Math.sign(deltaX) * Math.ceil(Math.abs(deltaX) / itemWidth);
            if (!carouselInner.dataset.isInfinite) {
                newStartIndex = adjustIndex(carouselInner, newStartIndex);
            }
        }

        const adjustIndexFunc = (newStartIndex) => {
            let idx = newStartIndex;
            if (carouselInner.dataset.isInfinite) {
                const totalItem = getTotalItem(carouselInner);
                const itemNum = getItemNum(carouselInner);
                if (idx > totalItem - itemNum) {
                    idx = 0;
                }
                if (idx < 0) {
                    idx = totalItem - itemNum;
                }
            }
            saveStartIndex(carouselInner, idx);
            updateIndicators(carouselInner, idx);

            return idx;
        };

        const tempFunc = () => {
            carouselInner.removeEventListener('transitionend', tempFunc);

            triggerSwipeEvent(carouselInner);

            // Chỉnh lại index
            const idx = adjustIndexFunc(newStartIndex);
            if (idx != newStartIndex) {
                updateScrollLeft(carouselInner, idx, itemWidth, false);
            }
        };
        carouselInner.addEventListener('transitionend', tempFunc);

        updateScrollLeft(carouselInner, newStartIndex, itemWidth, true);

        // Bỏ đánh dấu
        draggedMark.carouselInner = false;
    }

    /**
     * Tạo sự kiện swipe.
     * @param {DOMNode} carouselInner  Phần tử .carousel-inner
     */
    function triggerSwipeEvent(carouselInner) {
        const evt = new CustomEvent('swipe', {
            detail: {
                hazcheeseburger: true
            }
        });
        carouselInner.dispatchEvent(evt);
    }

    /**
     * Điều chỉnh lại chỉ số cho hợp lý.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     * @param {Integer} itemIndex Chỉ số đích
     */
    function adjustIndex(carouselInner, itemIndex) {
        const totalItem = getTotalItem(carouselInner);
        const itemNum = getItemNum(carouselInner);
        let idx = Math.min(itemIndex, totalItem - itemNum);
        idx = Math.max(idx, 0);
        return idx;
    }

    /**
     * Lưu lại chỉ số bắt đầu hiện tại, để sau này dùng (khi resize, khi bắt đầu drag lần nữa).
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     * @param {Integer} startIndex Chỉ số của phần tử đầu tiên
     */
    function saveStartIndex(carouselInner, startIndex) {
        carouselInner.dataset.startCarouselIndex = startIndex;
    }

    /**
     * Cập nhật indicator.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     * @param {Integer} startIndex Chỉ số của phần tử đầu tiên
     */
    function updateIndicators(carouselInner, startIndex) {
        const carousel = carouselInner.closest('.' + NAT_CAROUSEL_CLASS);
        const indicators = carousel.querySelectorAll('.nat-carousel-indicators [data-item-to]');
        indicators.forEach(e => {
            e.classList.remove('active');
        });
        if (indicators && indicators.length > startIndex) {
            indicators[startIndex].classList.add('active');
        }
    }

    /**
     * Lấy tổng số phần tử.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     */
    function getTotalItem(carouselInner) {
        let n = carouselInner.querySelectorAll('.nat-carousel-item').length;
        if (carouselInner.dataset.isInfinite) {
            n -= 2;
        }
        return n;
    }

    /**
     * Lấy số phần tử hiển thị đồng thời một lúc.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     */
    function getItemNum(carouselInner) {
        return getComputedStyle(carouselInner).getPropertyValue('--carouselItemNum');
    }

    /**
     * Lấy chỉ số phần tử bắt đầu hiện tại (được lưu trong dataset startCarouselIndex với hàm saveStartIndex).
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     */
    function getStartIndex(carouselInner) {
        const n = carouselInner.dataset.startCarouselIndex;
        return n ? parseInt(n) : 0;
    }

    /**
     * Cập nhật lại vị trí của trang hiện tại.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     * @param {Integer} startIndex Chỉ số phần tử bắt đầu
     * @param {Integer} itemWidth Độ rộng của một phần tử
     * @param {Boolean} animation Có hiển thị animation hay không (mặc định là có)
     */
    function updateScrollLeft(carouselInner, startIndex, itemWidth, animation) {
        if (!animation) {
            carouselInner.classList.add('no-transition');
        }

        let x = startIndex * itemWidth;
        if (carouselInner.dataset.isInfinite) {
            x += itemWidth;
        }
        carouselInner.style.transform = `translateX(${-x}px)`;

        if (!animation) {
            // Cần làm như sau để không bị nháy
            // Trigger a reflow, flushing the CSS changes
            // https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
            carouselInner.offsetHeight;

            carouselInner.classList.remove('no-transition');
        }
    }

    /**
     * Tính kích thước từng phần tử.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     */
    function calculateItemWidth(carouselInner) {
        const item = carouselInner.querySelector('.nat-carousel-item');
        const innerWidth = item.clientWidth; // offsetWidth
        const marginRight = parseInt(getComputedStyle(item).marginRight.replace('px', ''));
        return innerWidth + marginRight;
    }

    /**
     * Lắng nghe các sự kiện drag - touch.
     */
    function initDragEvents() {
        // Thêm tùy chọn { passive: false } để có thể gọi preventDefault
        // Bị xung đột với custom-control-checkbox của Bootstrap trên iPad :(
        window.addEventListener('touchstart', startDrag);
        window.addEventListener('touchmove', handleDrag, { passive: false });
        window.addEventListener('touchend', finishDrag);

        window.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', handleDrag, { passive: false });
        window.addEventListener('mouseup', finishDrag);
    }

    /**
     * Khi thay đổi kích thước trình duyệt thì cần tính lại chiều rộng từng phần tử,
     * cập nhật lại vị trí.
     */
    function initResizeEvent() {
        // Dùng kỹ thuật debounce function
        let windowResizeTimeout;

        window.addEventListener('resize', () => {
            clearTimeout(windowResizeTimeout);

            windowResizeTimeout = setTimeout(() => {
                adjustCarouselItemWidth();

                document.querySelectorAll('.' + NAT_CAROUSEL_INNER_CLASS).forEach(carouselInner => {
                    const itemWidth = calculateItemWidth(carouselInner);
                    const oldStartIndex = getStartIndex(carouselInner);
                    const startIndex = adjustIndex(carouselInner, oldStartIndex);
                    saveStartIndex(carouselInner, startIndex);
                    updateIndicators(carouselInner, startIndex);
                    updateScrollLeft(carouselInner, startIndex, itemWidth, true);
                });
            }, 400);
        });
    }

    /**
     * Lắng nghe các sự kiện khi click vào item trước, item sau.
     */
    function initClickControlEvent() {
        document.addEventListener('click', (evt) => {
            const carouselControl = evt.target.closest('.nat-carousel-control');
            if (carouselControl) {
                const carousel = carouselControl.closest('.' + NAT_CAROUSEL_CLASS);
                const carouselInner = carousel.querySelector('.' + NAT_CAROUSEL_INNER_CLASS);
                const itemWidth = calculateItemWidth(carouselInner);
                const oldStartIndex = getStartIndex(carouselInner);
                const direction = carouselControl.dataset.direction;
                let newStartIndex = oldStartIndex + (direction == 'prev' ? -1 : 1);

                const adjustIndexFunc = (newStartIndex) => {
                    const totalItem = getTotalItem(carouselInner);
                    const itemNum = getItemNum(carouselInner);

                    let idx = newStartIndex;
                    if (idx > totalItem - itemNum) {
                        idx = 0;
                    }
                    if (idx < 0) {
                        idx = totalItem - itemNum;
                    }

                    saveStartIndex(carouselInner, idx);
                    updateIndicators(carouselInner, idx);

                    return idx;
                };

                if (!carouselInner.dataset.isInfinite) {
                    // Chỉnh lại index
                    newStartIndex = adjustIndexFunc(newStartIndex);
                }

                const tempFunc = () => {
                    carouselInner.removeEventListener('transitionend', tempFunc);

                    if (carouselInner.dataset.isInfinite) {
                        // Chỉnh lại index
                        const idx = adjustIndexFunc(newStartIndex);
                        if (idx != newStartIndex) {
                            updateScrollLeft(carouselInner, idx, itemWidth, false);
                        }
                    }
                };
                carouselInner.addEventListener('transitionend', tempFunc);

                updateScrollLeft(carouselInner, newStartIndex, itemWidth, true);
            }
        });
    }

    /**
     * Xử lý sự kiện khi click vào indicator.
     */
    function initClickIndicatorEvent() {
        document.addEventListener('click', (evt) => {
            if (evt.target.matches('.nat-carousel-indicators [data-item-to]')) {
                const indicator = evt.target;
                const index = parseInt(indicator.dataset.itemTo);
                const carousel = indicator.closest('.' + NAT_CAROUSEL_CLASS);
                const carouselInner = carousel.querySelector('.' + NAT_CAROUSEL_INNER_CLASS);
                gotoItem(carouselInner, index, true);
            }
        });
    }

    /**
     * Chuyển đến phần tử tiếp theo hoặc đầu tiên.
     * Dùng ở hàm autoPlay.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     */
    function gotoNextOrFirstItem(carouselInner) {
        const itemWidth = calculateItemWidth(carouselInner);
        const oldStartIndex = getStartIndex(carouselInner);

        // Adjust
        const totalItem = getTotalItem(carouselInner);
        const itemNum = getItemNum(carouselInner);
        let newStartIndex = oldStartIndex + 1;
        if (newStartIndex > totalItem - itemNum) {
            newStartIndex = 0;
        }

        saveStartIndex(carouselInner, newStartIndex);
        updateIndicators(carouselInner, newStartIndex);
        updateScrollLeft(carouselInner, newStartIndex, itemWidth, true);
    }

    /**
     * Chuyển đến phần tử nào đó.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     * @param {Integer} index Chỉ số của phần tử
     * @param {Boolean} animation Có hiển thị animation hay không (mặc định là có)
     */
    function gotoItem(carouselInner, index, animation = true) {
        const itemWidth = calculateItemWidth(carouselInner);
        const startIndex = adjustIndex(carouselInner, index);
        saveStartIndex(carouselInner, startIndex);
        updateIndicators(carouselInner, startIndex);
        updateScrollLeft(carouselInner, startIndex, itemWidth, animation);
    }

    /**
     * Tự động chuyển slide sau một khoảng thời gian nhất định.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     * @param {Integer} duration Số milli giây
     */
    function autoPlay(carouselInner, duration) {
        // Kiểm tra xem con trỏ chuột
        let checkMouseIn = false;
        let checkFocus = false;

        // Xử lý các sự kiện: khi trỏ chuột thì không tự động play
        const carouselWrapper = carouselInner.closest('.nat-carousel-wrapper');
        if (carouselWrapper) {
            // focus, mouseenter, focusin
            // blur, mouseleave, focusout
            carouselWrapper.addEventListener('mouseenter', () => {
                checkMouseIn = true;
            });
            carouselWrapper.addEventListener('mouseleave', () => {
                checkMouseIn = false;
            });
            carouselWrapper.addEventListener('focusin', () => {
                checkFocus = true;
            });
            carouselWrapper.addEventListener('focusout', () => {
                checkFocus = false;
            });
        }

        setInterval(() => {
            // Auto play
            // Tự động thay đổi item
            if (!checkMouseIn && !checkFocus) {
                gotoNextOrFirstItem(carouselInner);
            }
        }, duration);
    }

    /**
     * Cho phép infinite.
     * @param {DOMNode} carouselInner Phần tử .carousel-inner
     */
    function makeInfinite(carouselInner) {
        // Clone phần tử đầu tiên và cuối cùng
        const items = carouselInner.querySelectorAll('.nat-carousel-item');
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        const cloneFirstItem = firstItem.cloneNode(true);
        const cloneLastItem = lastItem.cloneNode(true);
        cloneFirstItem.classList.add('clone');
        cloneLastItem.classList.add('clone');
        carouselInner.insertBefore(cloneLastItem, firstItem); // thêm phần tử cuối cùng vào đầu
        carouselInner.insertBefore(cloneFirstItem, lastItem.nextSibling); // thêm phần tử đầu tiên vào cuối

        // Đánh dấu
        carouselInner.dataset.isInfinite = true;

        adjustCarouselItemWidth();

        // Chỉnh lại trỏ đến phần tử đầu tiên
        gotoItem(carouselInner, 0, false);
    }

    /**
     * Điều chỉnh kích thước phần tử để đảm bảo hiển thị carousel hợp lý, không bị mất góc ở đầu (hiện tượng sub-pixel).
     */
    function adjustCarouselItemWidth() {
        document.querySelectorAll('.nat-carousel-item').forEach(item => {
            // Bỏ inline CSS cũ
            item.style.width = '';

            // Kích thước bình thường
            const originalWidth = Math.floor(parseFloat(getComputedStyle(item).width.replace('px', '')));

            // Làm tròn
            const newWidth = Math.round(originalWidth);

            item.style.width = newWidth + 'px';
        });
    }

    // Khởi tạo
    function init() {
        initDragEvents();
        initResizeEvent();
        initClickControlEvent();
        initClickIndicatorEvent();

        window.addEventListener('load', () => {
            adjustCarouselItemWidth();
        });

        // Chìa ra các API
        if (!globalThis.Carousel) {
            globalThis.Carousel = {
                autoPlay,
                gotoItem,
                makeInfinite,
                adjustCarouselItemWidth
            };
        }
    }

    init();
})();

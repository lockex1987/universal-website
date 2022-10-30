const PubSub = (function () {
    // Map sự kiện với mảng các handler của các subscriber
    const events = {};

    /**
     * Publish.
     * @param {String} topic Tên topic
     * @param {Object} data Dữ liệu
     */
    function publish(topic, data) {
        const handlers = events[topic];
        if (!!handlers === false) {
            return;
        }

        // Duyệt các handler và thực hiện
        handlers.forEach(function (handler) {
            // Try / catch?
            handler.call(this, data);
        });
    }

    /**
     * Subscribe.
     * @param {String} topic Tên topic
     * @param {Function} handler Hàm xử lý
     */
    function subscribe(topic, handler) {
        let handlers = events[topic];
        if (!!handlers === false) {
            events[topic] = [];
            handlers = events[topic];
        }

        // Thêm handler vào mảng
        handlers.push(handler);
    }

    /**
     * Bỏ subscribe.
     * @param {String} topic Tên topic
     * @param {Function} handler Hàm xử lý
     */
    function unsubscribe(topic, handler) {
        const handlers = events[topic];
        if (!!handlers === false) {
            return;
        }

        // Xóa handler khỏi mảng
        const idx = handlers.indexOf(handler);
        handlers.splice(idx, 1);
    }

    // Export 3 API
    return {
        publish,
        subscribe,
        unsubscribe
    };
})();

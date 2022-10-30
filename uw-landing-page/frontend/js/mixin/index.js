export default {
  methods: {
    /**
     * Hiện thị đối tượng moment theo định dạng ngày tháng
     */
    convertMomentToFrontendString(momentObject) {
      if (!momentObject) {
        return ''
      }
      return momentObject.format('DD/MM/YYYY')
    },

    /**
     * Format định dạng ngày tháng.
     */
    formatDate(date) {
      if (!date) {
        return ''
      }
      return moment(date.replace(/\//g, '-')).format('DD/MM/YYYY')
    },

    /**
     * Format định dạng ngày tháng.
     */
    formatDateTime(date, pattern = 'DD/MM/YYYY HH:mm:ss') {
      if (!date) {
        return ''
      }
      return moment(date.replace(/\//g, '-')).format(pattern)
    },

    /**
     * API đang sử dụng định dạng ngày tháng không đúng chuẩn ISO 8601, sử dụng dấu / thay cho dấu -.
     * Hàm này chuyển từ định dạng chuẩn sang định dạng mà API yêu cầu.
     * @param dateStr Xâu ngày tháng theo định dạng chuẩn
     */
    formatWithApiDateTimeFormat(dateStr) {
      if (!dateStr) {
        return ''
      }
      return dateStr.replace(/-/g, '/')
    },

    /**
     * API đang sử dụng định dạng ngày tháng không đúng chuẩn ISO 8601, sử dụng dấu / thay cho dấu -.
     * Hàm này chuyển từ định dạng của API sang định dạng chuẩn.
     * @param dateStr Xâu ngày tháng theo định dạng của API
     */
    normalizeApiDateTimeFormat(dateStr) {
      if (!dateStr) {
        return ''
      }
      return dateStr.replace(/\//g, '-')
    },

    /**
     * Hiển thị số có ngăn cách hàng nghìn.
     * @param {Number} num Số
     */
    formatNumber(num) {
      if (!num) {
        return num
      }
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },

    /**
     * Hiển thị làm tròn số.
     * @param {Number} num
     * @param {Number} digits
     */
    prettifyNumber(num, digits) {
      if (!digits) {
        digits = 1
      }

      const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'K' },
      ]
      for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          const n = (num / si[i].value).toFixed(digits)

          // Xóa những chữ số 0 đằng sau dấu thập phân
          // Nếu chỉ để 0+ thì sẽ không xóa được dấu .
          // Nếu chỉ để \.0+ thì sẽ không xử lý được trường hợp 123.400
          return n.replace(/\.?0+$/, '') + si[i].symbol
        }
      }
      return num
    },
  },
}

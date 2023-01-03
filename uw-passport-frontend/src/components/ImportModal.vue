<template>
  <div class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <form
          @submit.prevent="submitForm()"
          novalidate
        >
          <div class="modal-header">
            <div class="modal-title">
              {{ modalTitle }}
            </div>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            >
            </button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <ul>
                <li>
                  <strong>Ghi chú:</strong> Import file Excel
                  <ul>
                    <li>Mỗi lần không import quá 01 file</li>
                    <li>Mỗi thông tin hoạt động nằm trên một dòng</li>
                    <li>Mỗi file không quá {{ maxRows }} hoạt động</li>
                  </ul>
                </li>

                <li>
                  File mẫu import:
                  <a :href="'/static/template/' + templatePath">File mẫu</a>
                </li>
              </ul>
            </div>

            <div class="mb-3 text-danger">
              Chú ý:
              Quá trình import có thể mất một khoảng thời gian,
              vui lòng không thoát khỏi tab làm việc
            </div>

            <div class="mb-3">
              <input
                type="file"
                class="form-control"
                ref="excelFileInput"
                accept=".xlsx"
              />
            </div>

            <!-- Progress bar -->
            <div
              class="position-fixed top-left mt-4 w-100 text-center"
              v-if="totalRow > 0"
            >
              <div
                class="progress w-50 mx-auto"
                style="height: 3px"
              >
                <div
                  class="progress-bar"
                  :style="{ width: (processedRow * 100 / totalRow) + '%' }"
                >
                </div>
              </div>

              <div
                v-if="totalRow > 100"
                class="mt-2"
              >
                {{ formatNumber(processedRow) }} / {{ formatNumber(totalRow) }}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="submit"
              class="btn btn-primary"
            >
              Tải lên
              <span
                v-show="isSaving"
                class="la la-spin la-spinner"
              ></span>
            </button>

            <button
              type="button"
              class="btn btn-outline-primary ms-3"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { normalizeExcelCellData } from '~/helpers/excel.js'

export default {
  props: {
    // Tiêu đề của modal
    modalTitle: String,

    // Hàm validate dữ liệu
    validateRow: Function,

    // Hàm thêm mới dữ liệu
    insertRow: Function,

    // Hàm kiểm tra có phải là dòng chứa dữ liệu hay không
    isDataRow: {
      type: Function,
      default: rowData => {
        if (! rowData || ! rowData.length) {
          return false
        }
        return rowData.some(e => !! e)
      },
    },

    // Đường dẫn file mẫu
    templatePath: String,

    // Số bản ghi tối đa
    maxRows: Number,
  },

  data() {
    return {
      // Danh sách dữ liệu khi import Excel
      rows: null,

      // Có import thành công không
      isImportSuccess: true,

      // Tổng số bản ghi
      totalRow: 0,

      // Số bản ghi đã xử lý
      processedRow: 0,

      // Đang import
      isSaving: false,
    }
  },

  mounted() {
    $(this.$el).on('hidden.bs.modal', () => {
      CV.clearErrorMessages(this.$el)
      this.resetInfo()
    })
  },

  methods: {
    openModal() {
      $(this.$el).modal('show')
    },

    closeModal() {
      $(this.$el).modal('hide')
    },

    resetInfo() {
      this.rows = null
      this.isImportSuccess = true
      this.totalRow = 0
      this.processedRow = 0
      this.isSaving = false

      this.$refs.excelFileInput.value = ''
    },

    openImportForm() {
      this.openModal()
    },

    async submitForm() {
      if (this.isSaving) {
        return
      }

      if (CV.invalidForm(this.$el)) {
        return
      }

      if (! this.$refs.excelFileInput.value) {
        noti.error('Vui lòng chọn file')
        return
      }

      this.importExcel()
    },

    /**
     * Import dữ liệu Excel.
     */
    importExcel() {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const arrayBuffer = reader.result
        this.processImportFile(arrayBuffer)
        this.$refs.excelFileInput.value = ''
      })
      reader.readAsArrayBuffer(this.$refs.excelFileInput.files[0])
    },

    /**
     * Xử lý import.
     */
    async processImportFile(arrayBuffer) {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer)

      // Đọc sheet đầu tiên
      const worksheet = workbook.worksheets[0]

      // Xử lý từng dòng
      const rows = []
      worksheet.eachRow((row, rowNumber) => {
        // Dữ liệu bắt đầu từ phần tử thứ nhất
        if (rowNumber > 1) {
          rows.push({
            rowNumber,
            data: row.values.slice(1),
          })
        }
      })

      this.processImportData(rows)
    },

    /**
     * Xử lý dữ liệu file Excel.
     */
    processImportData(rows) {
      if (rows.length == 0) {
        noti.error('File Excel không có dữ liệu')
        return
      }

      if (this.maxRows && rows.length > this.maxRows) {
        noti.error('File Excel chứa tối đa ' + this.maxRows + ' dòng dữ liệu')
        return
      }

      this.rows = rows
      this.isImportSuccess = true
      this.totalRow = this.rows.length
      this.processedRow = 0
      this.isSaving = true

      // Bắt đầu import
      this.importSingleRow()
    },

    /**
     * Import từng dòng dữ liệu.
     */
    async importSingleRow() {
      // Nếu đã import xong
      if (this.rows.length == 0) {
        // Thông báo thành công
        if (this.isImportSuccess) {
          noti.success('Đã import xong')
          this.closeModal()
        }

        // Tìm kiếm lại
        this.$emit('done')

        // Ẩn progress bar
        this.totalRow = 0

        this.isSaving = false

        // Dừng lại
        return
      }

      // Lấy dữ liệu dòng hiện tại
      const currentRow = this.rows.shift()
      const rowNumber = currentRow.rowNumber
      const rowData = currentRow.data

      for (let idx = 0; idx < rowData.length; idx++) {
        rowData[idx] = normalizeExcelCellData(rowData, idx)
      }

      // Nếu không phải dòng dữ liệu thì bỏ qua và import tiếp
      if (! this.isDataRow(rowData)) {
        this.processedRow++
        this.importSingleRow()
        return
      }

      const validateErrors = this.validateRow(rowData)

      // Nếu có lỗi validate thì thông báo
      if (validateErrors.length) {
        this.processedRow++

        const messages = validateErrors.join('. ')
        noti.confirm('Lỗi ở dòng ' + rowNumber + '. ' + messages + '. Bạn có muốn tiếp tục?', () => {
          this.isSaving = true

          // Tiếp tục dòng nữa
          this.importSingleRow()
        })

        // Tìm kiếm lại
        this.$emit('done')

        // Ẩn progress bar
        this.totalRow = 0

        this.isSaving = false

        // Dừng lại
        return
      }

      // Gọi lên server
      const { data } = await this.insertRow(rowData)

      this.processedRow++

      // Xử lý dữ liệu trả về
      if (data.code == 0) {
        // Tiếp tục dòng nữa
        this.importSingleRow()
      } else if (data.code == 2 || data.code == 422) {
        this.isSaving = false

        noti.confirm('Lỗi ở dòng ' + rowNumber + '. ' + data.message + '. Bạn có muốn tiếp tục?', () => {
          this.isSaving = true

          // Tiếp tục dòng nữa
          this.importSingleRow()
        })
      } else {
        this.isSaving = false
        this.isImportSuccess = false
        noti.error('Đã có lỗi xảy ra')

        // Tìm kiếm lại
        this.$emit('done')

        // Ẩn progress bar
        this.totalRow = 0
      }
    },
  },
}
</script>


<style lang="scss" scoped>
.progress {
  max-width: 500px;
}
</style>

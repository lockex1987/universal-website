<template>
  <div
    class="modal fade"
    ref="rootEle"
  >
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


<script setup>
import ExcelJS from 'exceljs'
import { normalizeExcelCellData } from '@/helpers/excel.js'
// import bootstrap from 'bootstrap'
import * as bootstrap from 'bootstrap'

const props = defineProps({
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
})

const emit = defineEmits([
  'done',
])

// Danh sách dữ liệu khi import Excel
const rows = ref([])

// Có import thành công không
const isImportSuccess = ref(true)

// Tổng số bản ghi
const totalRow = ref(0)

// Số bản ghi đã xử lý
const processedRow = ref(0)

// Đang import
const isSaving = ref(false)

const rootEle = ref()

const excelFileInput = ref()

let myModal

const openModal = () => {
  myModal.show()
}

const closeModal = () => {
  myModal.hide()
}

const resetInfo = () => {
  rows.value = null
  isImportSuccess.value = true
  totalRow.value = 0
  processedRow.value = 0
  isSaving.value = false

  excelFileInput.value.value = ''
}

const openImportForm = () => {
  openModal()
}

const submitForm = async () => {
  if (isSaving.value) {
    return
  }

  /*
  if (CV.invalidForm(rootEle.value)) {
    return
  }
  */

  if (! excelFileInput.value.value) {
    noti.error('Vui lòng chọn file')
    return
  }

  importExcel()
}

const importExcel = () => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    const arrayBuffer = reader.result
    processImportFile(arrayBuffer)
    excelFileInput.value.value = ''
  })
  reader.readAsArrayBuffer(excelFileInput.value.files[0])
}

const processImportFile = async arrayBuffer => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  // Đọc sheet đầu tiên
  const worksheet = workbook.worksheets[0]

  // Xử lý từng dòng
  const rowsX = []
  worksheet.eachRow((row, rowNumber) => {
    // Dữ liệu bắt đầu từ phần tử thứ nhất
    if (rowNumber > 1) {
      rowsX.push({
        rowNumber,
        data: row.values.slice(1),
      })
    }
  })

  processImportData(rowsX)
}

const processImportData = rowsX => {
  if (rowsX.length == 0) {
    noti.error('File Excel không có dữ liệu')
    return
  }

  if (props.maxRows && rowsX.length > props.maxRows) {
    noti.error('File Excel chứa tối đa ' + props.maxRows + ' dòng dữ liệu')
    return
  }

  rows.value = rowsX
  isImportSuccess.value = true
  totalRow.value = rows.value.length
  processedRow.value = 0
  isSaving.value = true

  // Bắt đầu import
  importSingleRow()
}

const importSingleRow = async () => {
  // Nếu đã import xong
  if (rows.value.length == 0) {
    // Thông báo thành công
    if (isImportSuccess.value) {
      noti.success('Đã import xong')
      closeModal()
    }

    // Tìm kiếm lại
    emit('done')

    // Ẩn progress bar
    totalRow.value = 0

    isSaving.value = false

    // Dừng lại
    return
  }

  // Lấy dữ liệu dòng hiện tại
  const currentRow = rows.value.shift()
  const rowNumber = currentRow.rowNumber
  const rowData = currentRow.data

  for (let idx = 0; idx < rowData.length; idx++) {
    rowData[idx] = normalizeExcelCellData(rowData, idx)
  }

  // Nếu không phải dòng dữ liệu thì bỏ qua và import tiếp
  if (! props.isDataRow(rowData)) {
    processedRow.value++
    importSingleRow()
    return
  }

  const validateErrors = props.validateRow(rowData)

  // Nếu có lỗi validate thì thông báo
  if (validateErrors.length) {
    processedRow.value++

    const messages = validateErrors.join('. ')
    noti.confirm('Lỗi ở dòng ' + rowNumber + '. ' + messages + '. Bạn có muốn tiếp tục?', () => {
      isSaving.value = true

      // Tiếp tục dòng nữa
      importSingleRow()
    })

    // Tìm kiếm lại
    emit('done')

    // Ẩn progress bar
    totalRow.value = 0

    isSaving.value = false

    // Dừng lại
    return
  }

  // Gọi lên server
  const { data } = await props.insertRow(rowData)

  processedRow.value++

  // Xử lý dữ liệu trả về
  if (data.code == 0) {
    // Tiếp tục dòng nữa
    importSingleRow()
  } else if (data.code == 2 || data.code == 422) {
    isSaving.value = false

    noti.confirm('Lỗi ở dòng ' + rowNumber + '. ' + data.message + '. Bạn có muốn tiếp tục?', () => {
      isSaving.value = true

      // Tiếp tục dòng nữa
      importSingleRow()
    })
  } else {
    isSaving.value = false
    isImportSuccess.value = false
    noti.error('Đã có lỗi xảy ra')

    // Tìm kiếm lại
    emit('done')

    // Ẩn progress bar
    totalRow.value = 0
  }
}

onMounted(() => {
  myModal = new bootstrap.Modal(rootEle.value)

  rootEle.value.addEventListener('hidden.bs.modal', () => {
    // Bắt buộc nhập file
    // CV.clearErrorMessages(rootEle.value)
    resetInfo()
  })
})

defineExpose({
  openImportForm,
})
</script>


<style lang="scss" scoped>
.progress {
  max-width: 500px;
}
</style>

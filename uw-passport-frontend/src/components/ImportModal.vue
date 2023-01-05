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
                  <strong>Ghi chú:</strong>
                  <ul>
                    <li>Mỗi lần chọn một file Excel</li>
                    <li>Mỗi thông tin hoạt động nằm trên một dòng</li>
                  </ul>
                </li>

                <li>
                  <a :href="'/static/template/' + templatePath">File mẫu</a>
                </li>
              </ul>
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
              class="mb-3"
              v-if="totalRow > 0"
            >
              <div
                class="progress"
                style="height: 3px"
              >
                <div
                  class="progress-bar"
                  :style="{ width: (processedRow * 100 / totalRow) + '%' }"
                >
                </div>
              </div>

              <div class="mt-2">
                {{ formatNumber(processedRow) }} / {{ formatNumber(totalRow) }}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <a-button
              type="primary"
              htmlType="submit"
              :loading="isImporting"
            >
              Import
            </a-button>

            <a-button
              class="ms-3"
              data-bs-dismiss="modal"
            >
              Đóng
            </a-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import ExcelJS from 'exceljs'
import * as bootstrap from 'bootstrap'
import { normalizeExcelCellData } from '@/helpers/excel.js'
import { formatNumber } from '@/helpers/common.js'

const props = defineProps({
  modalTitle: {
    type: String,
    default: 'Import',
  },

  validateRow: Function,

  insertRow: Function,

  isDataRow: {
    type: Function,
    default: rowData => {
      if (! rowData || ! rowData.length) {
        return false
      }
      return rowData.some(e => !! e)
    },
  },

  templatePath: String,
})

const emit = defineEmits([
  'done',
])

const rows = ref([])

const isImportSuccess = ref(true)

const totalRow = ref(0)

const processedRow = ref(0)

const isImporting = ref(false)

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
  rows.value = []
  isImportSuccess.value = true
  totalRow.value = 0
  processedRow.value = 0
  isImporting.value = false

  excelFileInput.value.value = ''
}

const openImportForm = () => {
  openModal()
}

const submitForm = async () => {
  if (isImporting.value) {
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

  readExcelFileAsArrayBuffer()
}

const readExcelFileAsArrayBuffer = () => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    const arrayBuffer = reader.result
    loadArrayBufferIntoRows(arrayBuffer)
    excelFileInput.value.value = ''
  })
  reader.readAsArrayBuffer(excelFileInput.value.files[0])
}

const loadArrayBufferIntoRows = async arrayBuffer => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  // Đọc sheet đầu tiên
  const worksheet = workbook.worksheets[0]

  // Xử lý từng dòng
  const tempRows = []
  worksheet.eachRow((row, rowNumber) => {
    // Dữ liệu bắt đầu từ phần tử thứ nhất
    if (rowNumber > 1) {
      tempRows.push({
        rowNumber,
        data: row.values.slice(1),
      })
    }
  })

  if (tempRows.length == 0) {
    noti.error('File Excel không có dữ liệu')
    return
  }

  rows.value = tempRows
  startImportRows()
}

const startImportRows = () => {
  isImportSuccess.value = true
  totalRow.value = rows.value.length
  processedRow.value = 0
  isImporting.value = true

  // Bắt đầu import
  importSingleRow()
}

const importSingleRow = async () => {
  // Nếu đã import xong
  if (rows.value.length == 0) {
    if (isImportSuccess.value) {
      noti.success('Đã import xong')
      closeModal()
    }
    emit('done')
    totalRow.value = 0
    isImporting.value = false
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
  // TODO: Chuyển vào hàm loadArrayBufferIntoRows
  if (! props.isDataRow(rowData)) {
    processedRow.value++
    importSingleRow()
    return
  }

  const validateErrors = await props.validateRow(rowData)

  // Nếu có lỗi validate thì thông báo
  if (validateErrors.length) {
    processedRow.value++

    const messages = validateErrors.join('. ')
    noti.confirm('Lỗi ở dòng ' + rowNumber + '. ' + messages + '. Bạn có muốn tiếp tục?', () => {
      isImporting.value = true

      // Tiếp tục dòng nữa
      importSingleRow()
    })

    emit('done')
    totalRow.value = 0
    isImporting.value = false
    return
  }

  const { data } = await props.insertRow(rowData)

  processedRow.value++

  if (data.code == 0) {
    importSingleRow()
  } else if (data.code == 1 || data.code == 422) {
    isImporting.value = false
    const message = (data.code == 1) ? (data.message + '. ') : ''
    noti.confirm('Lỗi ở dòng ' + rowNumber + '. ' + message + 'Bạn có muốn tiếp tục?', () => {
      isImporting.value = true
      importSingleRow()
    })
  } else {
    isImporting.value = false
    isImportSuccess.value = false
    noti.error('Đã có lỗi xảy ra')
    emit('done')
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

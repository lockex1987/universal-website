<template>
  <ImportModal
    ref="importModal"
    modalTitle="Import file Lịch sử hoạt động"
    templatePath="ThichBaiDangTrenTrangNhomLL47.xlsx"
    :validateRow="validateRow"
    :insertRow="insertRow"
    :maxRows="200"
    @done="$emit('done')"
  />
</template>


<script setup>
import ImportModal from '@/components/ImportModal.vue'

/*
const facebookUrlPattern = 'https?:\\/\\/(www\\.)?(facebook|fb)\\.com\\/\\S+\\/?'

export default {
  components: {
    ImportModal,
  },

  props: {
    userId: String,

    pageList: Array,

    groupList: Array,
  },

  data() {
    return {
      // Biểu thức chính quy Facebook
      facebookPattern: '^' + facebookUrlPattern + '$',

      // Thời gian hiện tại
      currentDate: moment(),

      wallTypeList: [
        { id: 'page', name: 'Trang' },
        { id: 'group', name: 'Nhóm công khai' },
      ],
    }
  },

  methods: {
    openImportForm() {
      this.$refs.importModal.openModal()
    },

    // Kiểm tra dữ liệu của dòng.
    validateRow(rowData) {
      let col = 0
      const actionTimeStr = rowData[col++] ?? ''
      const wallTypeStr = rowData[col++] ?? ''
      const fbId = rowData[col++] ?? ''
      const sourceUrl = rowData[col++] ?? ''

      // Validate dữ liệu ở client
      const validateErrors = []

      const actionTimeRules = CV.parseValidationFromString('required')
      const actionTimeError = CV.validateByValueAndValidation(actionTimeStr, actionTimeRules)
      if (actionTimeError) {
        validateErrors.push('Thời gian: ' + actionTimeError)
      } else {
        const dateTimeFormat = 'DD/MM/YYYY HH:mm:ss'
        const actionTimeMoment = moment(actionTimeStr, dateTimeFormat)
        rowData[col++] = actionTimeMoment

        if (actionTimeMoment.format(dateTimeFormat) != actionTimeStr) {
          const message = 'Không đúng định dạng ' + dateTimeFormat
          validateErrors.push('Thời gian: ' + message)
        } else if (actionTimeMoment.isAfter(this.currentDate)) {
          const message = 'Không được sau hiện tại'
          validateErrors.push('Thời gian: ' + message)
        }
      }

      const wallTypeRules = CV.parseValidationFromString('required')
      const wallTypeError = CV.validateByValueAndValidation(wallTypeStr, wallTypeRules)
      let wallTypeId
      if (wallTypeError) {
        validateErrors.push('Nơi tương tác: ' + actionTimeError)
      } else {
        const placeTypeObj = this.wallTypeList.find(e => e.name.toLowerCase() == wallTypeStr.toLowerCase())
        if (! placeTypeObj) {
          validateErrors.push('Nơi tương tác phải là "Trang" hoặc "Nhóm công khai"')
        } else {
          rowData[col++] = placeTypeObj.id
          wallTypeId = placeTypeObj.id
        }
      }

      const fbIdRules = CV.parseValidationFromString('required')
      const fbIdError = CV.validateByValueAndValidation(fbId, fbIdRules)
      if (fbIdError) {
        validateErrors.push('Facebook ID của nơi tương tác: ' + fbIdError)
      } else {
        if (wallTypeId == 'page') {
          const pageObj = this.pageList.find(e => e.fbId.toLowerCase() == fbId.toLowerCase())
          if (! pageObj) {
            const message = 'Không tồn tại'
            validateErrors.push('Trang: ' + message)
          } else {
            rowData[col++] = pageObj.id
          }
        } else if (wallTypeId == 'group') {
          const groupObj = this.groupList.find(e => e.fbId.toLowerCase() == fbId.toLowerCase())
          if (! groupObj) {
            const message = 'Không tồn tại'
            validateErrors.push('Nhóm công khai: ' + message)
          } else {
            rowData[col++] = groupObj.id
          }
        }
      }

      const sourceUrlRules = CV.parseValidationFromString('required|maxLength:512')
      sourceUrlRules.regexPattern = this.facebookPattern
      sourceUrlRules.regexPatternMessage = 'Vui lòng nhập URL của Facebook'
      const sourceUrlError = CV.validateByValueAndValidation(sourceUrl, sourceUrlRules)
      if (sourceUrlError) {
        validateErrors.push('Đường dẫn bài đăng: ' + sourceUrlError)
      }

      return validateErrors
    },

    // Thêm mới dòng dữ liệu.
    async insertRow(rowData) {
      let col = 0
      const actionTimeStr = rowData[col++]
      const wallTypeStr = rowData[col++]
      const fbId = rowData[col++]
      const sourceUrl = rowData[col++]
      const actionTimeMoment = rowData[col++]
      const wallTypeId = rowData[col++]
      const wallId = rowData[col++]

      // Gọi lên server
      const params = {
        fb_user_id: this.userId,
        action_type: 'like',
        action_time: actionTimeMoment.format('YYYY/MM/DD HH:mm:ss'),
        source_url: sourceUrl,
        wall_type: wallTypeId,
        wall_id: wallId,
      }

      const response = await axios.post(ROOT_API + '/pg/user/action/insert', {
        apiMethod: 'POST',
        apiParams: params,
      })
      return response
    },
  },
}
*/
</script>

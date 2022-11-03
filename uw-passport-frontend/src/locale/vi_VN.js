import Pagination from 'ant-design-vue/es/vc-pagination/locale/vi_VN'
import DatePicker from 'ant-design-vue/es/date-picker/locale/vi_VN'
import TimePicker from 'ant-design-vue/es/time-picker/locale/vi_VN'
import Calendar from 'ant-design-vue/es/calendar/locale/vi_VN'

const typeTemplate = '${label} không phải là một ${type} hợp lệ'

const localeValues = {
  locale: 'vi',

  Pagination,
  DatePicker,
  TimePicker,
  Calendar,

  global: {
    placeholder: 'Vui lòng chọn',
  },

  Table: {
    filterTitle: 'Bộ ',
    filterConfirm: 'OK',
    filterReset: 'Tạo Lại',
    selectAll: 'Chọn Tất Cả',
    selectInvert: 'Chọn Ngược Lại',
  },

  Modal: {
    okText: 'OK',
    cancelText: 'Huỷ',
    justOkText: 'OK',
  },

  Popconfirm: {
    okText: 'OK',
    cancelText: 'Huỷ',
  },
  Transfer: {
    searchPlaceholder: 'Tìm ở đây',
    itemUnit: 'mục',
    itemsUnit: 'mục',
  },
  Upload: {
    uploading: 'Đang tải lên...',
    removeFile: 'Gỡ bỏ tập tin',
    uploadError: 'Lỗi tải lên',
    previewFile: 'Xem thử tập tin',
    downloadFile: 'Tải tập tin',
  },
  Empty: {
    description: 'Trống',
  },

  Form: {
    optional: '(tùy chọn)',

    defaultValidateMessages: {
      default: 'Lỗi validation cho ${label}',
      required: 'Vui lòng nhập ${label}',
      enum: '${label} must be one of [${enum}]',
      whitespace: '${label} cannot be a blank character',
      date: {
        format: '${label} date format is invalid',
        parse: '${label} cannot be converted to a date',
        invalid: '${label} is an invalid date',
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
      },
      string: {
        len: '${label} phải có ${len} ký tự',
        min: '${label} phải ít nhất ${min} ký tự',
        max: '${label} phải nhiều nhất ${max} ký tự',
        range: '${label} phải từ ${min} đến ${max} ký tự',
      },
      number: {
        len: '${label} phải bằng ${len}',
        min: '${label} phải nhỏ nhất bằng ${min}',
        max: '${label} phải lớn nhất bằng ${max}',
        range: '${label} phải từ ${min} đến ${max}',
      },
      array: {
        len: 'Must be ${len} ${label}',
        min: 'At least ${min} ${label}',
        max: 'At most ${max} ${label}',
        range: 'The amount of ${label} must be between ${min}-${max}',
      },
      pattern: {
        mismatch: '${label} does not match the pattern ${pattern}',
      },
    },
  },
}

export default localeValues

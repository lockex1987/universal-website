import ExcelJS from 'exceljs'
import { downloadBlob } from './common.js'

/**
 * Xuất file Excel.
 */
export const exportExcelCommon = async (list, columns, sheetName, fileName) => {
  // Tạo các đối tượng Workbook và Worksheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // Header
  worksheet.columns = columns

  // Thêm dữ liệu
  list.forEach(e => {
    worksheet.addRow(e)
  })

  // Style
  const borderStyle = {
    style: 'thin',
  }

  // Dòng header
  worksheet.getRow(1).eachCell(cell => {
    cell.border = {
      top: borderStyle,
      left: borderStyle,
      bottom: borderStyle,
      right: borderStyle,
    }
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }
    cell.font = {
      bold: true,
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF00B0F0',
      },
    }
  })

  // Các dòng dữ liệu
  for (let row = 2; row <= list.length + 1; row++) {
    const rowObject = worksheet.getRow(row)
    for (let colNumber = 1; colNumber <= columns.length; colNumber++) {
      const cell = rowObject.getCell(colNumber)
      cell.border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle,
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: columns[colNumber - 1].horizontalAlignment ?? 'left',
      }
    }
  }

  // Download file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  downloadBlob(blob, fileName)
}


/**
 * Chuẩn hóa dữ liệu import Excel.
 */
export const normalizeExcelCellData = (data, columnIndex) => {
  if (columnIndex >= data.length) {
    return ''
  }

  const value = data[columnIndex]
  // console.log(typeof value);

  // Dữ liệu rỗng
  if (typeof value == 'undefined') {
    return ''
  }

  if (typeof value == 'string') {
    return value.trim()
  }

  // Hyperlink
  if (typeof value == 'object') {
    const text = value.text
    if (typeof text == 'string') {
      return text.trim()
    }
    return ('' + text).trim()
  }

  // Số, chuyển về xâu
  return ('' + value).trim()
}

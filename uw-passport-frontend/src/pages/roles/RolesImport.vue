<template>
  <ImportModal
    ref="importModal"
    modalTitle="Import vai trò"
    templatePath="roles.xlsx"
    :validateRow="validateRow"
    :insertRow="insertRow"
    @done="$emit('done')"
  />
</template>


<script setup>
import Schema from 'async-validator'
import ImportModal from '@/components/ImportModal.vue'
import vietnameseValidatorMessages from '@/helpers/vietnamese-validator-messages.mjs'
// import viVN from '@/locale/vi_VN.js'
// const vietnameseValidatorMessages = viVN.Form.defaultValidateMessages

const rules = {
  code: [{ required: true, max: 100, fullField: 'Mã' }],
  name: [{ required: true, max: 100, fullField: 'Tên' }],
}

const validator = new Schema(rules)
validator.messages(vietnameseValidatorMessages)

const importModal = ref()

const openImportForm = () => {
  importModal.value.openImportForm()
}

const validateRow = async rowData => {
  let col = 0
  const code = rowData[col++] ?? ''
  const name = rowData[col++] ?? ''
  const data = {
    code,
    name,
  }

  const validateErrors = []
  try {
    await validator.validate(data)
  } catch ({ errors, fields }) {
    errors.forEach(e => {
      validateErrors.push(e.message)
    })
  }
  return validateErrors
}

const insertRow = async rowData => {
  let col = 0
  const code = rowData[col++]
  const name = rowData[col++]
  const params = {
    code,
    name,
    permissions: [],
  }
  const response = await axios.post('/api/roles/insert', params)
  return response
}

defineExpose({
  openImportForm,
})
</script>

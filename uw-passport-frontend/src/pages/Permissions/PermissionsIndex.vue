<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Quyền</li>
    </ol>
  </Teleport>

  <div class="d-flex flex-wrap align-items-center">
    <a-input
      v-model:value="filter.text"
      class="form-control-max-width mb-3"
      placeholder="Tìm kiếm"
    />
  </div>

  <div
    v-show="filteredPermissionList.length == 0"
    class="text-danger"
  >
    <a-empty />
  </div>

  <div v-show="filteredPermissionList.length > 0">
    <div class="table-responsive-md">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th class="text-end">
              #
            </th>
            <th>
              Mã
            </th>
            <th>
              Tên
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(permission, i) in filteredPermissionList"
            :key="permission.code"
          >
            <td class="text-end">
              {{ i + 1 }}
            </td>
            <td>
              {{ permission.code }}
            </td>
            <td>
              {{ permission.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { permissionList } from '@/helpers/permissions.mjs'

const filter = reactive({
  text: '',
})

const filteredPermissionList = computed(() => {
  const text = filter.text.trim().toLowerCase()
  const filterFunc = permission => permission.code.toLowerCase().includes(text) || permission.name.toLowerCase().includes(text)
  return permissionList.filter(filterFunc)
})
</script>

<template>
  <a-result
    status="403"
    title="403"
    sub-title="Bạn không có quyền thực hiện chức năng này"
  >
    <template #extra>
      <a-button type="primary">
        <RouterLink to="/">
          Quay lại
        </RouterLink>
      </a-button>
    </template>
  </a-result>
</template>

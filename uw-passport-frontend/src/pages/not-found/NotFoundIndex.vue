<template>
  <a-result
    status="404"
    title="404"
    sub-title="Không tìm thấy trang"
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

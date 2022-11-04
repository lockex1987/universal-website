<template>
  <a-breadcrumb class="mb-3">
    <a-breadcrumb-item>Tài khoản</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="row">
    <div class="col-lg-6">
      <div class="h-100 mb-5">
        <div class="fw-bold mb-3">
          Thông tin tài khoản
        </div>

        <UserInfo />
      </div>
    </div>

    <div class="col-lg-6">
      <div class="h-100 mb-5">
        <div class="fw-bold mb-3">
          Đổi mật khẩu
        </div>

        <ChangePassword />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserInfo from './UserInfo.vue'
import ChangePassword from './ChangePassword.vue'
</script>

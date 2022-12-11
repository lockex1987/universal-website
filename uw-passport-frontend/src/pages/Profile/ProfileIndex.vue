<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item active">Tài khoản</li>
    </ol>
  </Teleport>

  <div class="row">
    <div class="col-lg-4">
      <div class="h-100 mb-5">
        <div class="fw-bold mb-4">
          Thông tin tài khoản
        </div>

        <UserInfo />
      </div>
    </div>

    <div class="col-lg-4">
      <div class="h-100 mb-5">
        <div class="fw-bold mb-4">
          Đổi mật khẩu
        </div>

        <ChangePassword />
      </div>
    </div>

    <div class="col-lg-4">
      <div class="h-100 mb-5">
        <div class="fw-bold mb-4">
          TOTP
        </div>

        <Totp />
      </div>
    </div>
  </div>
</template>


<script setup>
import UserInfo from './UserInfo.vue'
import ChangePassword from './ChangePassword.vue'
import Totp from './Totp.vue'
</script>

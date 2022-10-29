<template>
  <div class="row">
    <div class="col-lg-6">
      <div class="h-100 mb-5">
        <div class="panel-header mb-3">
          Thông tin tài khoản
        </div>

        <UserInfo />
      </div>
    </div>

    <!--div class="col-lg-6">
      <div class="h-100 mb-5">
        <div class="panel-header mb-3">
          Đổi mật khẩu
        </div>

        <ChangePassword />
      </div>
    </div-->
  </div>
</template>

<script setup>
import UserInfo from './components/UserInfo.vue'
// import ChangePassword from './components/ChangePassword.vue'
</script>

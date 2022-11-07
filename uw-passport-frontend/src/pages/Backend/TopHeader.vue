<template>
  <div class="bg-light p-3 d-flex align-items-center justify-content-between">
    <button
      class="btn btn-link d-lg-none text-body"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasLeftSidebar"
      aria-controls="offcanvasLeftSidebar"
    >
      <span class="bi bi-list"></span>
    </button>

    <div class="fw-bold">
      UW
    </div>

    <div class="dropdown">
      <button
        class="btn btn-link text-decoration-none text-body dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        <img
          class="rounded-circle avatar object-fit-cover me-2"
          title="Đổi ảnh đại diện"
          :src="authStore.user.thumbnail ? ('/' + authStore.user.thumbnail) : '/static/images/user_avatar.png'"
          onerror="this.src = '/static/images/user_avatar.png'"
        />
        <span class="d-none d-lg-inline">
          {{ authStore.user.username }}
        </span>
      </button>

      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <RouterLink
            :to="{ name: 'Profile' }"
            class="dropdown-item"
            activeClass="active"
          >
            Tài khoản
          </RouterLink>
        </li>

        <li>
          <a
            class="dropdown-item"
            href="#"
            @click.prevent="processLogout()"
          >
            Đăng xuất
          </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const router = useRouter()

const processLogout = async () => {
  await axios.post('/api/auth/logout')
  authStore.user = {
    _id: null,
    username: '',
  }
  router.push('/Login')
}
</script>

<style scoped>
.avatar {
  width: 1rem;
  height: 1rem;
}
</style>

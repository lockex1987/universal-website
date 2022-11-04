<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <span class="navbar-brand">
        UW
      </span>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink
              :to="{ name: 'User' }"
              class="nav-link"
              activeClass="active"
            >
              Người dùng
            </RouterLink>
          </li>
        </ul>

        <div class="dropdown text-end">
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
            {{ authStore.user.username }}
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
    </div>
  </nav>
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

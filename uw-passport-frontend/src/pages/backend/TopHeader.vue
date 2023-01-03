<template>
  <div class="bg-light py-3 d-flex align-items-center">
    <div
      class="d-none d-lg-block ps-3"
      style="width: 300px"
    >
      <img src="/static/images/logo.svg" />
      <span class="fw-bold ms-2">
        Universal Website
      </span>
    </div>

    <button
      class="btn btn-link d-lg-none text-body"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasLeftSidebar"
      aria-controls="offcanvasLeftSidebar"
    >
      <span class="bi bi-list"></span>
    </button>

    <div id="appBreadcrumb"></div>

    <div class="dropdown ms-auto">
      <button
        class="btn btn-link text-decoration-none text-body dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        <img
          class="rounded-circle avatar object-fit-cover me-2"
          :src="loginUser.thumbnail ? ('/' + loginUser.thumbnail) : '/static/images/user_avatar.png'"
          onerror="this.src = '/static/images/user_avatar.png'"
        />
        <span class="d-none d-lg-inline">
          {{ loginUser.username }}
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
import { loginUser, setLogout } from '@/stores/auth.js'

const router = useRouter()

const processLogout = async () => {
  await axios.post('/api/auth/logout')
  setLogout()
  router.push('/login')
}
</script>


<style scoped>
.avatar {
  width: 1rem;
  height: 1rem;
  vertical-align: -2px;
}
</style>

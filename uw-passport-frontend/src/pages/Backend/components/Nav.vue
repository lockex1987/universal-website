<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <span class="navbar-brand">
        SeC
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
              :to="{ name: 'Profile' }"
              class="nav-link"
              activeClass="active"
            >
              Profile
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink
              :to="{ name: 'User' }"
              class="nav-link"
              activeClass="active"
            >
              User
            </RouterLink>
          </li>
        </ul>

        <div class="dropdown text-end">
          <button
            class="btn btn-link text-decoration-none text-body dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            {{ authStore.user.username }}
          </button>

          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="processLogout()"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const processLogout = async () => {
  await axios.post('/api/auth/logout')
  authStore.user = {
    id: null,
    username: '',
  }
  router.push('/Login')
}
</script>

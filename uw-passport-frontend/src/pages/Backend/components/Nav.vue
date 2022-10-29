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
              :to="{ name: 'dashboard' }"
              class="nav-link"
              activeClass="active"
            >
              Dashboard
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink
              :to="{ name: 'user' }"
              class="nav-link"
              activeClass="active"
            >
              User
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink
              :to="{ name: 'product' }"
              class="nav-link"
              activeClass="active"
            >
              Product
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink
              :to="{ name: 'order' }"
              class="nav-link"
              activeClass="active"
            >
              Order
            </RouterLink>
          </li>
        </ul>

        <div class="dropdown text-end">
          <button
            class="btn btn-link text-decoration-none text-body dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            {{ authStore.user.userName }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <RouterLink
                :to="{ name: 'changePassword' }"
                class="dropdown-item"
              >
                Change password
              </RouterLink>
            </li>

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

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { deleteToken } from '@/helpers/sso'
import axios from 'axios'

const authStore = useAuthStore()

const router = useRouter()

const processLogout = async () => {
  await axios.post('/logout')
  deleteToken()
  authStore.user = {
    id: null,
    userName: '',
  }
  router.push('/login')
}
</script>

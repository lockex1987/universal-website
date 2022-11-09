<template>
  <div
    class="offcanvas-lg offcanvas-start"
    id="offcanvasLeftSidebar"
  >
    <div class="offcanvas-header">
      <div class="offcanvas-title fw-bold">
        Universal website
      </div>

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        data-bs-target="#offcanvasLeftSidebar"
      ></button>
    </div>

    <div class="offcanvas-body p-0">
      <ul class="list-unstyled w-100">
        <template
          v-for="lv1 in menuList"
          :key="lv1.code"
        >
          <li
            v-if="lv1.children && lv1.children.length"
            class="sub-menu"
          >
            <a
              :href="'#' + lv1.code + 'Submenu'"
              data-bs-toggle="collapse"
              aria-expanded="false"
              class="position-relative dropdown-toggle"
            >
              {{ lv1.name }}
            </a>

            <ul
              class="collapse list-unstyled"
              :id="lv1.code + 'Submenu'"
            >
              <li
                v-for="lv2 in lv1.children"
                :key="lv2.code"
                data-bs-dismiss="offcanvas"
                data-bs-target="#offcanvasLeftSidebar"
              >
                <RouterLink :to="{ name: lv2.code }">
                  {{ lv2.name }}
                </RouterLink>
              </li>
            </ul>
          </li>

          <li
            v-else
            data-bs-dismiss="offcanvas"
            data-bs-target="#offcanvasLeftSidebar"
          >
            <RouterLink :to="{ name: lv1.code }">
              {{ lv1.name }}
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth.js'
import allMenus from '@/router/menus.js'

const authStore = useAuthStore()

// Lấy danh sách menu được phân quyền
const menuList = computed(() => {
  const userPermissions = authStore.user.permissions ?? []
  const hasPermission = lv => ! lv.permission || userPermissions.includes(lv.permission)

  // Có thể có trường hợp menu không có do không được phân quyền menu con nào
  allMenus.forEach(lv1 => {
    lv1.isGroup = (lv1.children && lv1.children.length)
  })

  const result = []
  allMenus.forEach(lv1 => {
    if (hasPermission(lv1)) {
      if (lv1.isGroup) {
        const children = (lv1.children ?? []).filter(lv2 => hasPermission(lv2))
        if (children.length) {
          result.push({
            ...lv1,
            children,
          })
        }
      } else {
        result.push(lv1)
      }
    }
  })
  return result
})

const openActiveMenu = () => {
  const activeLink = document.querySelector('#offcanvasLeftSidebar .router-link-active')
  if (activeLink) {
    const parentLiTag = activeLink.closest('.sub-menu')
    if (parentLiTag) {
      const subUlTag = parentLiTag.querySelector('.collapse')
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(subUlTag)
      bsCollapse.show()
    }
  }
}

onMounted(() => {
  openActiveMenu()
})
</script>


<style lang="scss">
#offcanvasLeftSidebar {
  @media (min-width: 992px) {
    // Ngăn cách luôn
    overflow-y: scroll;
  }

  a {
    padding: 1rem;
    padding-left: 1.5rem;
    display: block;
    // .text-body
    color: rgba(0, 0, 0, 0.85);
    text-decoration: none;

    &:hover,
    &.router-link-active {
      // .text-primary
      color: #7386D5;

      // .bg-light
      --bs-bg-opacity: 0.5;
      background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity));
    }
  }

  ul ul a {
    // Cấp 2 thì thụt vào sâu hơn
    padding-left: 2.5rem !important;
  }

  .dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    left: 0.25rem;
    transition: all 0.3s;
    transform: translateY(-50%) rotate(-90deg);
  }

  [aria-expanded="true"].dropdown-toggle::after {
    transform: translateY(-50%);
  }
}
</style>

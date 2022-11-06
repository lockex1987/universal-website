<template>

  <a
    class="btn btn-primary"
    data-bs-toggle="offcanvas"
    href="#offcanvasExample"
  >
    Link with href
  </a>

  <button
    class="btn btn-primary"
    type="button"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasExample"
  >
    Button with data-bs-target
  </button>

  <div
    class="offcanvas offcanvas-start"
    id="offcanvasExample"
  >
    <div class="offcanvas-header">
      <h5
        class="offcanvas-title"
        id="offcanvasExampleLabel"
      >
        Offcanvas
      </h5>

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
      ></button>
    </div>

    <div class="offcanvas-body">
      <ul class="list-unstyled ps-0">
        <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#home-collapse"
            aria-expanded="true"
          >
            Home
          </button>

          <div
            class="collapse show"
            id="home-collapse"
          >
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Overview</a>
              </li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Updates</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Reports</a></li>
            </ul>
          </div>
        </li>
        <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0"
            data-bs-toggle="collapse"
            data-bs-target="#dashboard-collapse"
            aria-expanded="true"
          >
            Dashboard
          </button>
          <div
            class="collapse show"
            id="dashboard-collapse"
            style=""
          >
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Overview</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Weekly</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Monthly</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Annually</a></li>
            </ul>
          </div>
        </li>
        <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#orders-collapse"
            aria-expanded="false"
          >
            Orders
          </button>
          <div
            class="collapse"
            id="orders-collapse"
          >
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >New</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Processed</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Shipped</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Returned</a></li>
            </ul>
          </div>
        </li>
        <li class="border-top my-3"></li>
        <li class="mb-1">
          <button
            class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#account-collapse"
            aria-expanded="false"
          >
            Account
          </button>
          <div
            class="collapse"
            id="account-collapse"
          >
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >New...</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Profile</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Settings</a></li>
              <li><a
                  href="#"
                  class="link-dark d-inline-flex text-decoration-none rounded"
                >Sign out</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div>
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      :open-keys="state.openKeys"
      @openChange="onOpenChange"
    >
      <a-sub-menu key="sub1">
        <template #icon>
          <i class="bi bi-envelope"></i>
        </template>

        <template #title>

          Quản trị
        </template>

        <a-menu-item
          v-for="lv1 in menuList"
          :key="lv1.code"
        >
          <RouterLink
            :to="{ name: lv1.code }"
            class="nav-link"
          >
            {{ lv1.name }}
          </RouterLink>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="sub2">
        <template #icon></template>
        <template #title>
          <AppstoreOutlined />
          Navigation Two
        </template>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-sub-menu
          key="sub3"
          title="Submenu"
        >
          <a-menu-item key="7">Option 7</a-menu-item>
          <a-menu-item key="8">Option 8</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>

      <a-sub-menu key="sub4">
        <template #icon>
          <SettingOutlined />
        </template>
        <template #title>Navigation Three</template>
        <a-menu-item key="9">Option 9</a-menu-item>
        <a-menu-item key="10">Option 10</a-menu-item>
        <a-menu-item key="11">Option 11</a-menu-item>
        <a-menu-item key="12">Option 12</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup>
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'

const menuList = [
  { code: 'User', name: 'Người dùng' },
  { code: 'DemoButton', name: 'Demo Button' },
]

const state = reactive({
  rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
  openKeys: ['sub1'],
  selectedKeys: ['User'],
})

/**
 * Accordion.
 * @param {Array} openKeys
 */
const onOpenChange = openKeys => {
  console.log(state.openKeys, openKeys)
  const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1)
  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : []
  }
}
</script>

<style>
.btn-toggle[aria-expanded="true"]::before {
  transform: rotate(90deg);
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform .35s ease;
  transform-origin: 0.5em 50%;
}
</style>

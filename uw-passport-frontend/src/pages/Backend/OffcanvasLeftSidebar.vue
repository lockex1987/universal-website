<template>
  <div
    class="offcanvas-lg offcanvas-start"
    id="offcanvasLeftSidebar"
  >
    <div class="offcanvas-header">
      <div class="offcanvas-title fw-bold text-white">
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
        <li>
          <a
            href="#homeSubmenu"
            data-bs-toggle="collapse"
            aria-expanded="false"
            class="position-relative dropdown-toggle"
          >
            Quản trị
          </a>

          <ul
            class="collapse list-unstyled"
            id="homeSubmenu"
          >
            <li
              v-for="lv1 in menuList"
              :key="lv1.code"
            >
              <RouterLink :to="{ name: lv1.code }">
                {{ lv1.name }}
              </RouterLink>
            </li>
          </ul>
        </li>

        <li>
          <a href="#">About</a>
        </li>

        <li>
          <a
            href="#pageSubmenu"
            data-bs-toggle="collapse"
            aria-expanded="false"
            class="position-relative dropdown-toggle"
          >
            Pages
          </a>

          <ul
            class="collapse list-unstyled"
            id="pageSubmenu"
          >
            <li>
              <a href="#">Page 1</a>
            </li>
            <li>
              <a href="#">Page 2</a>
            </li>
            <li>
              <a href="#">Page 3</a>
            </li>

          </ul>
        </li>

        <li>
          <a href="#">Portfolio</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const menuList = [
  { code: 'User', name: 'Người dùng' },
  { code: 'Org', name: 'Tổ chức' },
  { code: 'DemoButton', name: 'Demo Button' },
]

const state = reactive({
  rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
  openKeys: ['sub1'],
  selectedKeys: ['User'],
})

/**
 * TODO: Accordion.
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

// TODO: Mở sẵn menu đang highlight
</script>

<style lang="scss">
#offcanvasLeftSidebar {
  // @media (min-width: 992px) {}
  background-color: #7386D5 !important;

  a {
    padding: 1rem;
    display: block;
    color: #fff;
    text-decoration: none;
    transition: all 0.3s;

    &:hover,
    &.router-link-active {
      color: #7386D5;
      background: rgba(255, 255, 255, 0.5);
    }
  }

  ul ul a {
    padding-left: 30px !important;
    background: #6d7fcc;
  }

  .dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transition: all 0.3s;
    transform: translateY(-50%) rotate(-90deg);
  }

  a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;
  }

  [aria-expanded="true"].dropdown-toggle::after {
    transform: translateY(-50%);
  }
}
</style>

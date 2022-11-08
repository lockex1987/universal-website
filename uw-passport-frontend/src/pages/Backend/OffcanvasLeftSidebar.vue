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
        <li class="sub-menu">
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
          <a href="#">Dashboard</a>
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

    &.router-link-active {
      // .text-primary
      color: #7386D5;
    }
  }

  ul ul a {
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

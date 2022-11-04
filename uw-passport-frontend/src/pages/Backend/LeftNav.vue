<template>
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

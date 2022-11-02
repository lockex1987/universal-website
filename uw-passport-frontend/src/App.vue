<template>
  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>
</template>

<script setup>
// zh_CN, vi_VN, en_US, default
// vi_VN thiếu nhiều so với mặc định
// import zhCN from 'ant-design-vue/es/locale/default'
import viVN from './locale/vi_VN.js'

/*
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
*/

const locale = viVN
</script>

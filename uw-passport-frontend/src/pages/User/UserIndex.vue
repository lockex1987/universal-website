<template>
  <a-breadcrumb class="mb-3">
    <a-breadcrumb-item>Người dùng</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="d-flex flex-wrap align-items-center">
    <a-input
      v-model:value="filter.text"
      class="form-control-max-width mb-3"
      placeholder="Username"
      @input="debouncedSearch()"
    />

    <a-button
      type="primary"
      @click="openCreateForm()"
      class="mb-3 ms-auto"
    >
      Thêm mới
    </a-button>
  </div>

  <div
    v-show="pagi.total == 0"
    class="text-danger"
  >
    Không tìm thấy bản ghi
  </div>

  <div v-show="pagi.total > 0">
    <div class="table-responsive-md">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th class="text-right">
              #
            </th>
            <th>
              Tài khoản
            </th>
            <th>
              Tên đầy đủ
            </th>
            <th>
              Email
            </th>
            <th>
              Số điện thoại
            </th>
            <th class="text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(user, i) in userList"
            :key="user._id"
          >
            <td class="text-right">
              {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
            </td>
            <td>
              <img
                class="rounded-circle avatar object-fit-cover me-2"
                title="Đổi ảnh đại diện"
                :src="user.thumbnail ? ('/' + user.thumbnail) : '/static/images/user_avatar.png'"
                onerror="this.src = '/static/images/user_avatar.png'"
              />
              {{ user.username }}
            </td>
            <td>
              {{ user.fullName }}
            </td>
            <td>
              {{ user.email }}
            </td>
            <td>
              {{ user.phone }}
            </td>
            <td class="text-center">
              <i
                class="cursor-pointer font-size-1.5 text-primary bi bi-pencil-square"
                title="Cập nhật"
                @click="openUpdateForm(user)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-md-flex justify-content-between">
      <div class="text-muted">
        Tìm thấy {{ pagi.total }} bản ghi
      </div>

      <!-- :pageSize="size" -->

      <a-pagination
        v-model:current="pagi.currentPage"
        :total="pagi.total"
        show-less-items
      />
    </div>
  </div>
</template>

<script setup>
import { debounce } from '@/helpers/common.js'

const filter = reactive({
  text: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const userList = ref([])

const dropdowns = reactive({
  // Danh sách ở các dropdown
})

const search = async page => {
  const params = {
    text: filter.text,
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/user/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  userList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const router = useRouter()

const openCreateForm = () => {
  router.push({
    name: 'UserForm',
    params: { _id: 0 },
  })
}

const openUpdateForm = user => {
  router.push({
    name: 'UserForm',
    params: { _id: user._id },
  })
}

onMounted(() => {
  search(1)
})
</script>

<style scoped>
.avatar {
  width: 1rem;
  height: 1rem;
}
</style>

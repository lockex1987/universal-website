<template>
  <h4>
    User
  </h4>

  <div class="d-flex flex-wrap align-items-center">
    <input
      type="text"
      placeholder="Name"
      class="form-control form-control-inline-width mb-3"
      v-model.trim="searchText"
      @input="debouncedSearch()"
    />
  </div>

  <div
    v-show="total == 0"
    class="text-danger"
  >
    No record
  </div>

  <div v-show="total > 0">
    <div class="table-responsive-md">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th class="text-center">
              STT
            </th>
            <th class="text-center">
              Name
            </th>
            <th class="text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(user, i) in userList"
            :key="user.id"
          >
            <td class="text-center">
              {{ (currentPage - 1) * limit + i + 1 }}
            </td>

            <td>
              {{ user.user_name }}
            </td>

            <td class="text-center">
              <i
                class="cursor-pointer font-size-1.5 text-primary bi bi-pencil-square"
                title="Update"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <div class="text-muted">
        {{ total }} records
      </div>

      <ElPagination
        layout="prev, pager, next"
        :hideOnSinglePage="true"
        :pageSize="limit"
        :total="total"
        v-model:currentPage="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ElPagination } from 'element-plus'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { debounce } from '@/composables/common'

type User = {
  id: number
  user_name: string
}

const limit = 10
const total = ref(-1)
const currentPage = ref(1)
const userList = ref([] as any[]) // as User[]
const searchText = ref('')

const search = async (page: number) => {
  const params = {
    search: searchText.value,
    page,
    limit,
  }
  const { data } = await axios.post('/user/search', params)
  total.value = data.meta.total
  currentPage.value = data.meta.current_page ?? page
  userList.value = data.data
}

const debouncedSearch = debounce(() => search(1), 500)

onMounted(() => {
  search(1)
})
</script>

<template>
  <h4>
    User
  </h4>

  <div class="d-flex flex-wrap align-items-center">
    <input
      type="text"
      class="form-control form-control-inline-width mb-3"
      placeholder="Username"
      v-model.trim="text"
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
              #
            </th>
            <th class="text-center">
              Username
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
              {{ (currentPage - 1) * size + i + 1 }}
            </td>

            <td>
              {{ user.username }}
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
        Tìm thấy {{ total }} bản ghi
      </div>

      <!-- :pageSize="size" -->

      <a-pagination
        v-model:current="currentPage"
        :total="total"
        show-less-items
      />
    </div>
  </div>
</template>

<script setup>
import { debounce } from '@/helpers/common.js'

const size = 10
const total = ref(-1)
const currentPage = ref(1)
const userList = ref([])
const text = ref('')

const search = async page => {
  const params = {
    text: text.value,
    page,
    size,
  }
  const { data } = await axios.post('/api/user/search', params)
  total.value = data.total
  currentPage.value = page
  userList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

onMounted(() => {
  search(1)
})
</script>

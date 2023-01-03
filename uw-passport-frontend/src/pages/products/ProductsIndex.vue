<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Danh mục</li>
      <li class="breadcrumb-item active">Sản phẩm</li>
    </ol>
  </Teleport>

  <div v-show="screen == 'list'">
    <div class="d-flex flex-wrap align-items-center">
      <a-input
        v-model:value="filter.text"
        class="form-control-max-width mb-4"
        placeholder="Tên, mô tả"
        @input="debouncedSearch()"
      />

      <a-button
        type="primary"
        @click="openForm()"
        class="mb-4 ms-auto"
      >
        Thêm mới
      </a-button>
    </div>

    <div
      v-show="pagi.total == 0"
      class="text-danger"
    >
      <a-empty />
    </div>

    <div v-show="pagi.total > 0">
      <div class="table-responsive-md">
        <table class="table table-borderless">
          <thead>
            <tr>
              <th class="text-end">
                #
              </th>
              <th>
                Ảnh
                &amp;
                Tên
                &amp;
                Mô tả
              </th>
              <th class="text-end">
                Giá
              </th>
              <th class="text-center">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(product, i) in productList"
              :key="product._id"
            >
              <td class="text-end">
                {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
              </td>
              <td style="width: 50%">
                <div class="d-flex align-items-start">
                  <img
                    class="thumbnail me-4"
                    :src="product.image ? (product.image.startsWith('http') ? product.image : '/' + product.image) : '/static/images/user_avatar.png'"
                    onerror="this.src = '/static/images/user_avatar.png'"
                  />

                  <div>
                    <div class="line-clamp-ellipsis-1 fw-semibold b-2">
                      {{ product.title }}
                    </div>

                    <div class="line-clamp-ellipsis-3">
                      {{ product.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-end">
                {{ product.price }}
              </td>
              <td class="text-center">
                <i
                  class="cursor-pointer text-primary bi bi-pencil-square"
                  title="Cập nhật"
                  @click="openForm(product)"
                />

                <i
                  class="cursor-pointer text-primary bi bi-trash ms-3"
                  title="Xóa"
                  @click="deleteRow(product)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <a-pagination
        v-model:current="pagi.currentPage"
        :total="pagi.total"
        :hideOnSinglePage="true"
        :showSizeChanger="false"
        :showTotal="total => `Tìm thấy ${total} bản ghi`"
        @change="search"
      />
    </div>
  </div>

  <div v-show="screen == 'form'">
    <ProductsForm
      ref="frmRef"
      @close="screen = 'list'"
      @updated="search(pagi.currentPage)"
      @inserted="search(1)"
    />
  </div>
</template>


<script setup>
import ProductsForm from './ProductsForm.vue'
import { debounce } from '@/helpers/common.js'

const filter = reactive({
  text: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const productList = ref([])

const frmRef = ref()

const screen = ref('list')

const search = async page => {
  const params = {
    text: filter.text.trim(),
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/products/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  productList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const openForm = role => {
  frmRef.value.openForm(role)
  screen.value = 'form'
}

const deleteRow = role => {
  noti.confirm('Bạn có muốn xóa bản ghi?', async () => {
    const { data } = await axios.delete('/api/products/delete/' + role._id)
    if (data.code == 0) {
      noti.success('Xóa bản ghi thành công')
      search(1)
    }
  })
}

onMounted(() => {
  search(1)
})
</script>


<style scoped>
.thumbnail {
  width: 5rem;
  height: auto;
}
</style>

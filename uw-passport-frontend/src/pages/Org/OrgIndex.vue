<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Quản trị</li>
      <li class="breadcrumb-item active">Tổ chức</li>
    </ol>
  </Teleport>

  <div v-show="screen == 'list'">
    <div class="row">
      <div class="col-lg-3">
        <a-input
          v-model:value="filter.text"
          class="form-control-max-width mb-3"
          placeholder="Tìm kiếm"
          @input="debouncedSearch()"
        />

        <a-tree
          :tree-data="dropdowns.orgTree"
          @select="selectOrgTree"
        />
      </div>

      <div class="col-lg-9">
        <div class="d-flex flex-wrap align-items-center">
          <a-button
            type="primary"
            @click="openForm()"
            class="mb-3 ms-auto"
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
                    Tên
                  </th>
                  <th>
                    Mô tả
                  </th>
                  <th class="text-center">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(org, i) in orgList"
                  :key="org._id"
                >
                  <td class="text-end">
                    {{ (pagi.currentPage - 1) * pagi.size + i + 1 }}
                  </td>
                  <td>
                    {{ org.name }}
                  </td>
                  <td>
                    {{ org.description }}
                  </td>
                  <td class="text-center">
                    <i
                      class="cursor-pointer font-size-1.5 text-primary bi bi-pencil-square"
                      title="Cập nhật"
                      @click="openForm(org)"
                    />

                    <i
                      class="cursor-pointer font-size-1.5 text-primary bi bi-trash ms-3"
                      title="Xóa"
                      @click="deleteRow(org)"
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
    </div>
  </div>

  <div v-show="screen == 'form'">
    <OrgForm
      ref="frmRef"
      :orgTree="dropdowns.orgTree"
      @close="screen = 'list'"
      @updated="search(pagi.currentPage); getOrgTree();"
      @inserted="search(1); getOrgTree();"
    />
  </div>
</template>

<script setup>
import OrgForm from './OrgForm.vue'
import { debounce } from '@/helpers/common.js'
import { convertToTreeData } from '@/helpers/tree.js'

const filter = reactive({
  text: '',
  selectedOrg: '',
})

const pagi = reactive({
  size: 10,
  total: -1,
  currentPage: 1,
})

const orgList = ref([])

const dropdowns = reactive({
  orgTree: [],
})

const frmRef = ref()

const screen = ref('list')

const search = async page => {
  const params = {
    text: filter.text.trim(),
    selectedOrg: filter.selectedOrg,
    page,
    size: pagi.size,
  }
  const { data } = await axios.post('/api/orgs/search', params)
  pagi.total = data.total
  pagi.currentPage = page
  orgList.value = data.list
}

const debouncedSearch = debounce(() => search(1), 500)

const openForm = org => {
  frmRef.value.openForm(org)
  screen.value = 'form'
}

const deleteRow = org => {
  noti.confirm('Bạn có muốn xóa bản ghi?', async () => {
    const { data } = await axios.delete('/api/orgs/delete/' + org._id)
    if (data.code == 0) {
      noti.success('Xóa bản ghi thành công')
      search(1)
      getOrgTree()
    }
  })
}

const getOrgTree = async () => {
  const { data } = await axios.get('/api/orgs/get-all')
  dropdowns.orgTree = convertToTreeData(data)
}

const selectOrgTree = (selectedKeys, evt) => {
  filter.selectedOrg = selectedKeys.length ? selectedKeys[0] : ''
  search(1)
}

onMounted(() => {
  search(1)
  getOrgTree()
})
</script>

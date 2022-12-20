<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Demo</li>
      <li class="breadcrumb-item active">Demo Tree Select</li>
    </ol>
  </Teleport>

  <h4>Basic usage</h4>
  <p>The most basic usage.</p>
  <div class="mb-4">
    <a-tree-select
      v-model:value="value1"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      tree-default-expand-all
      :tree-data="treeData1"
    >
      <template #title="{ value: val, title }">
        <b
          v-if="val === 'parent 1-1'"
          style="color: #08c"
        >
          sss
        </b>
        <template v-else>
          {{ title }}
        </template>
      </template>
    </a-tree-select>
  </div>

  <h4>Multiple Selection</h4>
  <p>Multiple selection usage.</p>
  <div class="mb-4">
    <a-tree-select
      v-model:value="value2"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      multiple
      tree-default-expand-all
      :tree-data="treeData2"
    >
      <template #title="{ value: val, title }">
        <b
          v-if="val === 'parent 1-1'"
          style="color: #08c"
        >
          {{ val }}
        </b>
        <template v-else>
          {{ title }}
        </template>
      </template>
    </a-tree-select>
  </div>

  <h4>Checkable</h4>
  <p>Multiple and checkable.</p>
  <div class="mb-4">
    <a-tree-select
      v-model:value="value3"
      style="width: 100%"
      :tree-data="treeData3"
      tree-checkable
      allow-clear
      :show-checked-strategy="SHOW_PARENT"
      placeholder="Please select"
    />
  </div>

  <h4>Virtual scroll</h4>
  <p>Use virtual list through height prop.</p>
  <div class="mb-4">
    <a-tree-select
      v-model:value="checkedKeys4"
      style="width: 100%"
      tree-checkable
      tree-default-expand-all
      :show-checked-strategy="SHOW_PARENT"
      :height="233"
      :tree-data="treeData4"
      :max-tag-count="10"
    >
      <template #title="{ title, value }">
        <span
          v-if="value === '0-0-1-0'"
          style="color: #1890ff"
        >
          {{ title }}
        </span>
        <template v-else>
          {{ title }}
        </template>
      </template>
    </a-tree-select>
  </div>

  <h4>Custom Tag Render</h4>
  <p>Allows for custom rendering of tags.</p>
  <div class="mb-4">
    <a-tree-select
      v-model:value="value5"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      multiple
      :show-checked-strategy="SHOW_ALL"
      tree-default-expand-all
      :tree-data="treeData5"
    >
      <template #tagRender="{ label, closable, onClose, option }">
        <a-tag
          :closable="closable"
          :color="option.color"
          style="margin-right: 3px"
          @close="onClose"
        >
          {{ label }}&nbsp;&nbsp;
        </a-tag>
      </template>

      <template #title="{ value: val, title }">
        <b
          v-if="val === 'parent 1-1'"
          style="color: #08c"
        >
          {{ val }}
        </b>
        <template v-else>
          {{ title }}
        </template>
      </template>
    </a-tree-select>
  </div>
</template>


<script setup>
import { TreeSelect } from 'ant-design-vue'

// Demo 1
const value1 = ref()

const treeData1 = ref([{
  title: 'parent 1',
  value: 'parent 1',
  children: [
    {
      title: 'parent 1-0',
      value: 'parent 1-0',
      children: [
        {
          title: 'my leaf',
          value: 'leaf1',
        },
        {
          title: 'your leaf',
          value: 'leaf2',
        },
      ],
    },
    {
      title: 'parent 1-1',
      value: 'parent 1-1',
    },
  ],
}])

watch(value1, () => {
  console.log(value1.value)
})


// Demo 2
const value2 = ref([])

const treeData2 = ref([{
  title: 'parent 1',
  value: 'parent 1',
  children: [
    {
      title: 'parent 1-0',
      value: 'parent 1-0',
      children: [
        {
          title: 'my leaf',
          value: 'leaf1',
        },
        {
          title: 'your leaf',
          value: 'leaf2',
        },
      ],
    },
    {
      title: 'parent 1-1',
      value: 'parent 1-1',
    },
  ],
}])

watch(value2, () => {
  console.log('select', value2.value)
})


// Demo 3
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData3 = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        disabled: true,
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
      },
    ],
  },
]

const value3 = ref(['0-0-0'])

watch(value3, () => {
  console.log(value3.value)
})


// Demo 4
function dig(path = '0', level = 3) {
  const list = []
  for (let i = 0; i < 10; i += 1) {
    const value = `${path}-${i}`
    const treeNode = {
      title: value,
      value,
    }
    if (level > 0) {
      treeNode.children = dig(value, level - 1)
    }
    list.push(treeNode)
  }
  return list
}

const checkedKeys4 = ref(['0-0-0', '0-0-1'])

watch(checkedKeys4, () => {
  console.log('checkedKeys', checkedKeys4.value)
})

const treeData4 = dig()


// Demo 5
const SHOW_ALL = TreeSelect.SHOW_ALL

const value5 = ref(['parent 1', 'parent 1-0', 'leaf1'])

const treeData5 = ref([
  {
    title: 'parent 1',
    value: 'parent 1',
    color: 'pink',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        color: 'orange',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1',
            color: 'green',
          },
          {
            title: 'your leaf',
            value: 'leaf2',
            color: 'cyan',
          },
        ],
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1',
        color: 'blue',
      },
    ],
  },
])

watch(value5, () => {
  console.log('select', value5.value)
})
</script>

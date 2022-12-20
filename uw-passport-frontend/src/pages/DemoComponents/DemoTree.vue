<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Demo</li>
      <li class="breadcrumb-item active">Demo Tree</li>
    </ol>
  </Teleport>

  <h4>Cách sử dụng cơ bản</h4>
  <p>The most basic usage, tell you how to use checkable, selectable, disabled, defaultExpandKeys, and etc.</p>
  <div class="mb-4">
    <a-tree
      v-model:expandedKeys="expandedKeys1"
      v-model:selectedKeys="selectedKeys1"
      v-model:checkedKeys="checkedKeys1"
      checkable
      :tree-data="treeData1"
    >
      <template #title="{ title, key }">
        <span
          v-if="key === '0-0-1-0'"
          style="color: #1890ff"
        >
          {{ title }}
        </span>
        <template v-else>
          {{ title }}
        </template>
      </template>
    </a-tree>
  </div>

  <h4>Load data asynchronously</h4>
  <p>To load data asynchronously when click to expand a treeNode.</p>
  <div class="mb-4">
    <a-tree
      v-model:expandedKeys="expandedKeys2"
      v-model:selectedKeys="selectedKeys2"
      :load-data="onLoadData2"
      :tree-data="treeData2"
    />
  </div>

  <h4>Searchable</h4>
  <p>Searchable Tree.</p>
  <div class="mb-4">
    <a-input-search
      v-model:value="searchValue3"
      style="margin-bottom: 8px"
      placeholder="Search"
    />

    <a-tree
      :expanded-keys="expandedKeys3"
      :auto-expand-parent="autoExpandParent3"
      :tree-data="gData3"
      @expand="onExpand3"
    >
      <template #title="{ title }">
        <span v-if="title.indexOf(searchValue3) > -1">
          {{ title.substr(0, title.indexOf(searchValue3)) }}<span style="color: #f50">{{ searchValue3 }}</span>{{
              title.substr(title.indexOf(searchValue3) + searchValue3.length)
          }}
        </span>
        <span v-else>
          {{ title }}
        </span>
      </template>
    </a-tree>
  </div>
</template>


<script setup>
// Demo 1
const treeData1 = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          { key: '0-0-1-0', title: 'sss' },
        ],
      },
    ],
  },
]

const expandedKeys1 = ref(['0-0-0', '0-0-1'])
const selectedKeys1 = ref(['0-0-0', '0-0-1'])
const checkedKeys1 = ref(['0-0-0', '0-0-1'])

watch(expandedKeys1, () => {
  console.log('expandedKeys', expandedKeys1)
})

watch(selectedKeys1, () => {
  console.log('selectedKeys', selectedKeys1)
})

watch(checkedKeys1, () => {
  console.log('checkedKeys', checkedKeys1)
})


// Demo 2
const treeData2 = ref([
  {
    title: 'Expand to load',
    key: '0',
  },
  {
    title: 'Expand to load',
    key: '1',
  },
  {
    title: 'Tree Node',
    key: '2',
    isLeaf: true,
  },
])
const expandedKeys2 = ref([])
const selectedKeys2 = ref([])

const onLoadData2 = treeNode => {
  return new Promise(resolve => {
    if (treeNode.dataRef.children) {
      resolve()
      return
    }

    setTimeout(() => {
      treeNode.dataRef.children = [
        {
          title: 'Child Node',
          key: `${treeNode.eventKey}-0`,
        },
        {
          title: 'Child Node',
          key: `${treeNode.eventKey}-1`,
        },
      ]
      treeData2.value = [...treeData2.value]
      resolve()
    }, 1000)
  })
}


// Demo 3
const x = 3
const y = 2
const z = 1

const genData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || genData
  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({
      title: key,
      key,
    })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}

generateData(z)

const dataList = []

const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({
      key,
      title: key,
    })
    if (node.children) {
      generateList(node.children)
    }
  }
}

generateList(genData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const expandedKeys3 = ref([])
const searchValue3 = ref('')
const autoExpandParent3 = ref(true)
const gData3 = ref(genData)
const onExpand3 = keys => {
  expandedKeys3.value = keys
  autoExpandParent3.value = false
}
watch(searchValue3, value => {
  const expanded = dataList
    .map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, gData3.value)
      }
      return null
    })
    .filter((item, i, self) => item && self.indexOf(item) === i)

  expandedKeys3.value = expanded
  searchValue3.value = value
  autoExpandParent3.value = true
})
</script>

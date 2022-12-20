export const convertToTreeData = flatData => {
  const treeData = []
  flatData.forEach(rootRow => {
    if (! rootRow.parentId) {
      const children = getChildrenNode(flatData, rootRow)
      const rootNode = {
        title: rootRow.name,
        // Bị lỗi Warning: `key` or `value` with TreeNode must be the same or you can remove one of them
        // value: rootRow.name, // để search
        value: rootRow._id,
        key: rootRow._id,
        _id: rootRow._id,
        children,
      }
      treeData.push(rootNode)
    }
  })
  return treeData
}

export const getTreeDataIgnoreId = (treeData, _id) => {
  const newTreeData = []
  treeData.forEach(rootNode => {
    if (rootNode._id != _id) {
      const children = getChildrenNodeIgnoreId(rootNode.children, _id)
      newTreeData.push({
        title: rootNode.title,
        value: rootNode.value,
        key: rootNode.key,
        _id: rootNode._id,
        children,
      })
    }
  })
  return newTreeData
}

const getChildrenNodeIgnoreId = (children, _id) => {
  const newChildren = []
  children.forEach(childNode => {
    if (childNode._id != _id) {
      const grandChildren = getChildrenNodeIgnoreId(childNode.children, _id)
      newChildren.push({
        title: childNode.title,
        value: childNode.value,
        key: childNode.key,
        _id: childNode._id,
        children: grandChildren,
      })
    }
  })
  return newChildren
}

const getChildrenNode = (flatData, parentRow) => {
  const children = []
  flatData.forEach(childRow => {
    if (childRow.parentId == parentRow._id) {
      const grandChildren = getChildrenNode(flatData, childRow)
      const childNode = {
        title: childRow.name,
        // value: childRow.name, // để search
        value: childRow._id,
        key: childRow._id,
        _id: childRow._id,
        children: grandChildren,
      }
      children.push(childNode)
    }
  })
  return children
}

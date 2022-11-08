/**
 * Sinh ra trường path cho các nút gốc.
 * TODO: Xóa đi.
 */
const generatePathOfRoots = data => {
  data.forEach(e => {
    if (! e.parentId) {
      e.path = '/' + e.id + '/'
      generatePathOfChildren(data, e)
    }
  })
}

/**
 * Sinh ra trường path cho các nút con.
 * TODO: Xóa đi.
 */
const generatePathOfChildren = (data, parent) => {
  data.forEach(e => {
    if (e.parentId == parent.id) {
      e.path = parent.path + e.id + '/'
      generatePathOfChildren(data, e)
    }
  })
}

export const convertToTreeData = flatData => {
  const treeData = []
  flatData.forEach(rootRow => {
    if (! rootRow.parentId) {
      const children = getChildrenNode(flatData, rootRow)
      const rootNode = {
        title: rootRow.name,
        value: rootRow._id,
        key: rootRow._id,
        children,
      }
      treeData.push(rootNode)
    }
  })
  return treeData
}

const getChildrenNode = (flatData, parentRow) => {
  const children = []
  flatData.forEach(childRow => {
    if (childRow.parentId == parentRow._id) {
      const grandChildren = getChildrenNode(flatData, childRow)
      const childNode = {
        title: childRow.name,
        value: childRow._id,
        key: childRow._id,
        children: grandChildren,
      }
      children.push(childNode)
    }
  })
  return children
}

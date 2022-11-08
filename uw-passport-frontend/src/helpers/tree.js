// TODO: Xóa đi

/**
 * Sinh ra trường path cho các nút gốc.
 */
export const generatePathOfRoots = data => {
  data.forEach(e => {
    if (! e.parentId) {
      e.path = '/' + e.id + '/'
      generatePathOfChildren(data, e)
    }
  })
}

/**
 * Sinh ra trường path cho các nút con.
 */
export const generatePathOfChildren = (data, parent) => {
  data.forEach(e => {
    if (e.parentId == parent.id) {
      e.path = parent.path + e.id + '/'
      generatePathOfChildren(data, e)
    }
  })
}

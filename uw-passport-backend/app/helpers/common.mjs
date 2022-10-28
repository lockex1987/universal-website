export const pick = (obj, ...props) => {
  if (! obj || ! props) {
    return null
  }

  const picked = {}
  props.forEach(prop => {
    picked[prop] = obj[prop]
  })
  return picked
}

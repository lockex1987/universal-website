import { fileURLToPath, URL } from 'url'

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

export const getBasePath = () => {
  return fileURLToPath(new URL('../..', import.meta.url))
}

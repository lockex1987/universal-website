import { ref, reactive, computed } from 'vue'

export const loginUser = reactive({
  _id: null,
  username: '',
})

export const isLoggedIn = computed(() => !! loginUser._id)

export const setLogout = () => {
  Object.assign(loginUser, {
    _id: null,
    username: '',
  })
}

export const setLogin = userData => {
  Object.assign(loginUser, userData)
}

export const beforeLoginPath = ref('')

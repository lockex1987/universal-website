import { defineStore } from 'pinia'

// Dùng Pinia mới thiết lập được từ API (axios)
// ref của Vue không được
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: null,
      username: '',
    },
    beforeLoginPath: '',
  }),
})

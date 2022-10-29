import { reactive, ref } from 'vue'

export const user = reactive({
  id: null,
  username: '',
})

// TODO: Không cần ref, chỉ cần một biến bình thường
export const beforeLoginPath = ref('')

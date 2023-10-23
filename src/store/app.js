import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAppStore = defineStore('app', () => {
  const user = reactive({
    avatar: '',
    email: '',
    id: 0,
    nickname: '',
    role: 0,
    signature: '',
    username: ''
  })

  return { user }
})

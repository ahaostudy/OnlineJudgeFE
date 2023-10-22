import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useProblemStore = defineStore('problem', () => {
  const difficulty = reactive(['简单', '中等', '困难'])
  return { difficulty }
})

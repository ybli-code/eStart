import { defineStore } from 'pinia'

export interface TodoItem {
  text: string
  created: number
  time?: number
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    unfinish: [] as TodoItem[],
    finish: [] as TodoItem[]
  }),
  actions: {
    addTodo(text: string) {
      const newTodo: TodoItem = {
        text,
        created: Date.now(),
        time: Date.now()
      }
      this.unfinish.unshift(newTodo)
    },
    toggleFinish(index: number) {
      const item = this.unfinish.splice(index, 1)[0]
      this.finish.unshift(item)
    },
    toggleUnfinish(index: number) {
      const item = this.finish.splice(index, 1)[0]
      this.unfinish.unshift(item)
    },
    deleteUnfinish(index: number) {
      this.unfinish.splice(index, 1)
    },
    deleteFinish(index: number) {
      this.finish.splice(index, 1)
    }
  },
  persist: true
})

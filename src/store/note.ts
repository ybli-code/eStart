import { defineStore } from 'pinia'

export interface NoteItem {
  text: string
  created: number
  fixed: boolean
  animation?: boolean
}

export const useNoteStore = defineStore('note', {
  state: () => ({
    noteList: [] as NoteItem[]
  }),
  actions: {
    setNoteList(list: NoteItem[]) {
      this.noteList = list
    },
    addNote(note: NoteItem) {
      this.noteList.push(note)
    },
    updateNote(index: number, note: NoteItem) {
      this.noteList.splice(index, 1, note)
    },
    deleteNote(index: number) {
      this.noteList.splice(index, 1)
    }
  },
  persist: true
})

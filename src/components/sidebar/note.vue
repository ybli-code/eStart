<template>
  <div class="side-note">
    <ul class="note-list">
      <li class="note-item" @click="addNote">
        <el-icon class="mr5"><Plus /></el-icon>
        新建笔记
      </li>
      <li
        v-for="(row, index) of noteStore.noteList"
        :key="index"
        @click="rowHandle(row, index)"
        class="note-item"
        :class="{ active: index == noteIndex }"
      >
        <span class="note-item-text d-elip">
          {{ row.text ? row.text : "新建笔记" }}
        </span>
        <p class="f14 note-handle">
          <d-icon
            v-if="row.text"
            v-size="16"
            class="icon mr5"
            :icon="`icon-fixed-${row.fixed ? 'solid' : 'line'}`"
            @click.stop="noteFixed(row, index)"
            :title="`${row.fixed ? '取消' : '固定'}到桌面`"
          />

          <el-icon
            v-if="index != noteIndex"
            class="icon"
            @click.stop="noteDelete(index)"
            title="删除"
          ><Close /></el-icon>
        </p>
      </li>
    </ul>
    <div class="note-input">
      <textarea
        @input="textInput"
        v-model="value"
        rows="2"
        placeholder="写点儿什么吧"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from "dayjs"
import { Plus, Close } from '@element-plus/icons-vue'
import { useNoteStore, NoteItem } from '@/store/note'

const noteStore = useNoteStore()

const value = ref("")
const noteIndex = ref(0)

const init = () => {
  noteIndex.value = 0
  if (noteStore.noteList.length > 0) {
    value.value = noteStore.noteList[0].text
  }
}

const addNote = () => {
  const newNote: NoteItem = {
    text: "",
    created: dayjs().valueOf(),
    fixed: false,
  }
  noteStore.noteList.unshift(newNote)
  noteIndex.value = 0
  value.value = ""
}

const rowHandle = (row: NoteItem, index: number) => {
  noteIndex.value = index
  value.value = row.text
}

const textInput = () => {
  if (noteStore.noteList[noteIndex.value]) {
    noteStore.noteList[noteIndex.value].text = value.value
    noteStore.noteList[noteIndex.value].created = dayjs().valueOf()
  }
}

const noteFixed = (row: NoteItem, index: number) => {
  row.fixed = !row.fixed
  row.animation = false
}

const noteDelete = (index: number) => {
  noteStore.deleteNote(index)
  if (noteIndex.value === index) {
    noteIndex.value = 0
    value.value = noteStore.noteList[0]?.text || ""
  } else if (noteIndex.value > index) {
    noteIndex.value--
  }
}

onMounted(() => {
  init()
})
</script>

<style lang='less' scoped>
.side-note {
  display: flex;
  height: 100%;
  .note-list {
    min-width: 150px;
    max-width: 150px;
    width: 150px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    .note-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 13px;
      color: rgba(var(--main-color), 0.7);
      line-height: 40px;
      padding: 0 10px;
      font-weight: 500;
      .note-item-text {
        flex: 1;
      }
      .note-handle {
        display: none;
        .icon {
          color: rgba(var(--main-color), 0.7);
        }
      }
      &.active {
        color: #1e6fff;
      }
      &:hover {
        background: rgba(var(--main-color), 0.1);
        .note-handle {
          display: block;
        }
      }
      &:first-child {
        margin-bottom: 20px;
        text-align: center;
        background: rgba(var(--main-color), 0.05);
      }
    }
  }
  .note-input {
    flex: 1;
    textarea {
      background: transparent;
      border: none;
      outline: none;
      color: rgba(var(--main-color), 0.8);
      padding: 20px 10px;
      box-sizing: border-box;
      font-size: 14px;
      display: block;
      width: 100% !important;
      height: 100% !important;
      resize: none;
    }
  }
}
</style>
<!--
 * @Author: web.王晓冬
 * @Date: 2020-10-23 10:09:07
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2020-10-30 09:09:43
 * @Description: pinned
-->
<template>
  <div class="app-pinned">
    <template v-for="(row, index) of noteList" :key="row.created">
      <div
        :class="{ zoomOut: row.animation }"
        class="pinned-item"
        v-if="row.fixed"
      >
        <d-icon
          class="icon-close"
          icon="icon-close"
          @click="noteFixed(row, index)"
        ></d-icon>
        <div
          @blur="noteInput($event, row, index)"
          contenteditable
          class="pinned-text"
        >
          {{ row.text }}
        </div>
        <time class="pinned-time">{{
          formatTime(row.created, "YYYY-MM-DD HH:mm")
        }}</time>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNoteStore, type NoteItem } from '@/store/note'
import dayjs from 'dayjs'

const noteStore = useNoteStore()
const noteList = computed(() => noteStore.noteList)

const formatTime = (value: number, formatString = 'YYYY-MM-DD') => {
  if (!value) return ''
  return dayjs(value).format(formatString)
}

const noteInput = (e: any, row: NoteItem, index: number) => {
  const newRow = { ...row, text: e.target.textContent }
  noteStore.updateNote(index, newRow)
}

const noteFixed = (row: NoteItem, index: number) => {
  const animatingRow = { ...row, animation: true }
  noteStore.updateNote(index, animatingRow)
  
  setTimeout(() => {
    const fixedRow = { ...animatingRow, animation: false, fixed: !animatingRow.fixed }
    noteStore.updateNote(index, fixedRow)
  }, 180)
}
</script>

<style lang='less' scoped>
.app-pinned {
  position: absolute;
  left: 80px;
  top: 90px;
  width: 300px;
  perspective: 500px;
  transition: all 0.25s;

  .pinned-item {
    position: relative;
    transition-duration: 0.25s;
    cursor: pointer;
    font-size: 13px;
    padding: 15px 20px;
    background: rgba(var(--background), 0.7);
    border-radius: 5px;
    color: rgba(var(--main-color), 0.8);
    margin-bottom: 10px;

    .icon-close {
      opacity: 0;
      transition-duration: 0.2s;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 14px;
      color: rgba(var(--main-color), 0.8);
    }
    &:hover {
      transform: rotateX(3deg) rotateY(-3deg);
      .icon-close {
        opacity: 1;
      }
    }
    .pinned-text {
      border: none;
      text-align: left;
      word-break: break-all;
    }
    .pinned-time {
      margin-top: 5px;
      display: block;
      color: rgba(var(--main-color), 0.3);
      font-size: 12px;
    }
  }
}
[contenteditable]:focus {
  outline: none;
}
</style>

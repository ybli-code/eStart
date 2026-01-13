<template>
  <ul class="d-tabs">
    <li
      class="d-tabs-item"
      v-for="(row, index) of data"
      :key="index"
      :class="{ active: modelValue == index }"
      @click="tabClick(row, index)"
    >
      {{ (row as any).label || row }}
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number
  data: any[] | Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'tab-click', row: any, index: string | number): void
}>()

const tabClick = (row: any, index: string | number) => {
  emit('update:modelValue', index)
  emit('tab-click', row, index)
}
</script>

<style lang='less' scoped>
.d-tabs {
  .d-tabs-item {
    cursor: pointer;
    text-align: center;
    flex: 1;
    color: rgba(var(--main-color), 1);
    border-bottom: 1px solid transparent;
    display: inline-block;
    padding: 0 20px;
    &.active {
      background-color: rgba(var(--main-color), 0.02);
      color: var(--primary-color);
      border-color: var(--main-color);
    }
    &:hover {
      color: var(--primary-color);
    }
  }
  line-height: 40px;
  background-color: rgba(var(--main-color), 0.06);
  color: rgba(var(--color), 1);
}
</style>
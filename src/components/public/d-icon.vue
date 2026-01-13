<template>
  <i v-if="isRemix" :class="[icon]" class="d-icon-remix" @click="handleClick"></i>
  <svg v-else class="d-icon" @click="handleClick" aria-hidden="true">
    <use :xlink:href="`#${icon}`" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const isRemix = computed(() => {
  return props.icon && (props.icon.startsWith("ri-") || props.icon.startsWith("remix-"))
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style lang="less" scoped>
.d-icon {
  cursor: pointer;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.d-icon-remix {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
  color: inherit;
}
</style>

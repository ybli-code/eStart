/*
 * @Author: web.王晓冬
 * @Date: 2020-10-27 10:31:35
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2020-10-28 10:22:49
 * @Description: file content
*/
<template>
  <i v-if="isRemix" :class="[icon]" class="d-icon-remix" @click="handleClick"></i>
  <svg v-else class="d-icon" @click="handleClick" aria-hidden="true">
    <use :xlink:href="`#${icon}`" />
  </svg>
</template>

<script>
export default {
  name: "dIcon",

  props: {
    icon: String,
  },
  computed: {
    isRemix() {
      return this.icon && (this.icon.startsWith("ri-") || this.icon.startsWith("remix-"));
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    },
  },
};
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

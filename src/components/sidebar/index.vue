<template>
  <div class="app-sidebar-box">
    <transition name="el-fade-in">
      <div
        class="app-sidebar-cover"
        @click="settingStore.setShowSide({ val: false })"
        v-show="settingStore.showSide"
      ></div>
    </transition>

    <div class="app-sidebar-content" :class="{ active: settingStore.showSide }">
      <h2 class="sidebar-title">
        {{ titles[settingStore.sideComp] || '设置' }}
        <div class="ar fr">
          <el-icon
            class="sidebar-close"
            title="关闭"
            @click="settingStore.setShowSide({ val: false })"
          >
            <Close />
          </el-icon>
        </div>
      </h2>
      <div class="app-sidebar-main">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

const titles: Record<string, string> = {
  weather: "天气",
  todo: "待办事项",
  note: "便笺",
  setting: "设置",
  add: "新增",
}

const componentsMap: Record<string, any> = {
  weather: defineAsyncComponent(() => import("./weather.vue")),
  todo: defineAsyncComponent(() => import("./todo.vue")),
  note: defineAsyncComponent(() => import("./note.vue")),
  setting: defineAsyncComponent(() => import("./setting/index.vue")),
  add: defineAsyncComponent(() => import("./add.vue")),
}

const activeComponent = computed(() => {
  return componentsMap[settingStore.sideComp] || null
})
</script>

<style lang="less" scoped>
.app-sidebar-cover {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 99;
}
.app-sidebar-content {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  box-shadow: 10px 10px 20px 20px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100%;
  z-index: 100;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  &.active {
    right: 0;
  }
}
.sidebar-title {
  padding: 20px;
  color: #fff;
  font-size: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  .sidebar-close {
    cursor: pointer;
    font-size: 24px;
    opacity: 0.6;
    transition: 0.2s;
    &:hover {
      opacity: 1;
      transform: rotate(90deg);
    }
  }
}
.app-sidebar-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>

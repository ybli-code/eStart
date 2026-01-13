<template>
  <div class="app-container">
    <div class="app-content">
      <!-- 顶部内容 -->
      <Header />

      <!-- 时间 -->
      <DateTime />
      <!-- 搜索框功能 -->
      <SearchBox />
      <!-- 应用列表 -->
      <transition name="app-group-fade">
        <AppGroupNav class="d-cell" v-show="!hideAppGroup" />
      </transition>

      <div class="yiyan-container d-cell">
        <Yiyan v-if="yiyanVisible" />
      </div>
    </div>
    <!-- 便笺贴 -->
    <Pinned />
    <!-- 侧边栏 -->
    <SideBar />
    <Login />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import Login from "@/components/login.vue"
import Header from "@/components/header.vue"
import DateTime from "@/components/date-time.vue"
import SearchBox from "@/components/search-box.vue"
import AppGroupNav from "@/components/app-group-nav.vue"
import Pinned from "@/components/pinned.vue"
import { useSettingStore } from '@/store/setting'

const Yiyan = defineAsyncComponent(() => import("@/components/yiyan.vue"))
const SideBar = defineAsyncComponent(() => import("@/components/sidebar/index.vue"))

const settingStore = useSettingStore()

const yiyanVisible = computed(() => settingStore.setContent.yiyan)
const hideAppGroup = computed(() => (settingStore as any).hideAppGroup)
</script>

<style lang="less" scoped>
.app-container {
  height: 100%;
  width: 100%;
}
.app-content {
  height: 100%;
  display: flex;
  flex-flow: column;
}
.app-logo {
  height: 80px;
  width: 180px;
  color: #fff;
  display: inline-block;
  font-size: 80px;
}
.yiyan-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

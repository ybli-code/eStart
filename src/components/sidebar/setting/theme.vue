<!--
 * @Author: web.王晓冬
 * @Date: 2020-10-15 21:52:45
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2020-10-27 15:12:48
 * @Description: setting 主题
-->
<template>
  <section class="set-section">
    <h2>主题</h2>
    <ul>
      <li class="d-flex-between">
        深色模式
        <el-switch
          v-model="themeMode"
          :disabled="settingStore.setContent.sunrise"
          active-value="dark"
          inactive-value="light"
        ></el-switch>
      </li>
      <li class="d-flex-between">
        <div>
          跟随日出日落
          <span class="f12" v-color="'rgba(var(--main-color),.4)'" v-if="settingStore.weatherData.sun">
            日出:{{ settingStore.weatherData.sun.rise }},日落:{{
              settingStore.weatherData.sun.set
            }}
          </span>
        </div>
        <el-switch v-model="sunrise"></el-switch>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

const themeMode = computed({
  get() {
    return settingStore.setContent.themeMode
  },
  set(val: string) {
    settingStore.setThemeMode(val)
  }
})

const sunrise = computed({
  get() {
    return settingStore.setContent.sunrise
  },
  set(val: boolean) {
    const setContent = { ...settingStore.setContent, sunrise: val }
    settingStore.setSetContent(setContent)
  }
})
</script>

<style lang='less' scoped>
</style>

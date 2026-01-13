<template>
  <div class="app-header">
    <div
      v-if="settingStore.setContent.showWeather"
      @click="settingStore.setShowSide({ val: true, comp: 'weather' })"
      class="header-webther fl d-flex-ver d-pointer"
    >
      <svg v-size="22" class="icon ml5" aria-hidden="true">
        <use :xlink:href="`#icon-${weatherIconMap[settingStore.weatherData.now.cond_code] || 'qing'}`" />
      </svg>
      <span class="wea">{{ settingStore.weatherData.now.tmp }}</span>
      <em class="super">{{ airType }}</em>
    </div>
    <div class="header-setting fr">
      <d-icon
        icon="icon-setting"
        title="设置"
        @click="settingStore.setShowSide({ val: true, comp: 'setting' })"
        class="icon-handle d-inline f24"
      ></d-icon>
      <d-icon
        icon="icon-add"
        title="添加网站"
        @click="settingStore.setShowSide({ val: true, comp: 'add' })"
        class="icon-handle d-inline f24 ml10"
      ></d-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from "dayjs"
import http from "@/api"
import { useSettingStore } from '@/store/setting'
import { weatherIconMap } from '@/utils/constants'

const settingStore = useSettingStore()
const airType = ref("°C")
let timer: any = null

const getCityLocal = () => {
  http.getCityLocal()
    .then((res: any) => {
      const data = res.data || res // axios response structure
      getWeather(data.id || data.cid)
    })
}

const getWeather = (city: string) => {
  http.getWeather(city).then((res: any) => {
    if (!res || res.status !== "ok") return
    
    const weatherData = {
      ...res,
      location: res.basic?.location || ''
    }
    
    // Determine moment (day/night)
    if (res.sun) {
      const nowDate = dayjs().format("YYYY-MM-DD")
      const rise = new Date(`${nowDate} ${res.sun.rise}`).getTime()
      const set = new Date(`${nowDate} ${res.sun.set}`).getTime()
      const nowTamp = dayjs().valueOf()
      const moment = nowTamp > rise && nowTamp < set ? "d" : "n"
      settingStore.setMoment(moment as 'd' | 'n')
    }
    
    settingStore.setWeather(weatherData)
  })
}

onMounted(() => {
  getCityLocal()
  timer = setInterval(() => {
    getCityLocal()
  }, 1000 * 60 * 60)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="less" scoped>
.app-header {
  padding: 10px 20px;
  height: 50px;
  box-sizing: border-box;
  .header-webther {
    color: #fff;
    .wea {
      font-size: 18px;
      margin-left: 5px;
    }
    .super {
      font-size: 12px;
      vertical-align: super;
      margin-left: 2px;
    }
  }
  .header-setting {
    .icon-handle {
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>

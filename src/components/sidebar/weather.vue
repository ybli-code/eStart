<!--
 * @Author: web.王晓冬
 * @Date: 2020-10-12 18:03:48
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2021-06-10 14:46:22
 * @Description: 天气
-->
<template>
  <div
    class="side-weather ac"
    :style="{
      backgroundImage: `url(
          https://cdn.heweather.com/img/plugin/190516/bg/h5/${settingStore.weatherData.now.cond_code}${settingStore.moment}.png
        )`,
    }"
  >
    <div class="side-weather-city f30 mt30">{{ settingStore.weatherData.location }}</div>
    <div class="side-weather-wea d-flex-center mt10 mb10 f14">
      <d-icon
        v-size="22"
        class="mr5"
        :icon="`icon-${weatherIconMap[settingStore.weatherData.now.cond_code as keyof typeof weatherIconMap] || 'qing'}`"
      />
      {{ settingStore.weatherData.now.cond_txt }}
    </div>

    <div class="side-weather-tem mb10 b" style="font-size: 60px">
      {{ settingStore.weatherData.now.tmp }}°
    </div>
    <div class="side-weather-tem f13" v-if="settingStore.weatherData.daily_forecast">
      最高{{ settingStore.weatherData.daily_forecast[0].tmp_max }}° 最低{{
        settingStore.weatherData.daily_forecast[0].tmp_min
      }}°
    </div>
    <!-- 气压 -->
    <ul class="side-weather-box f12">
      <li class="box-item">
        <d-icon v-size="26" icon="icon-fengxiang" />
        <p>风向</p>
        <p>{{ settingStore.weatherData.now.wind_dir }}{{ settingStore.weatherData.now.wind_sc }}级</p>
      </li>
      <li class="box-item">
        <d-icon v-size="26" icon="icon-air" />

        <p>空气质量</p>
        <p v-if="settingStore.weatherData.air_now_city">
          {{ settingStore.weatherData.air_now_city.qlty }}/{{ settingStore.weatherData.air_now_city.aqi }}
        </p>
      </li>
      <li class="box-item">
        <d-icon v-size="26" icon="icon-shidu" />
        <p>湿度</p>

        <p>{{ settingStore.weatherData.now.hum }}%</p>
      </li>
    </ul>
    <!-- 当天小时天气 -->
    <ul class="side-weather-hours d-auto-x i-scrollbar-hide">
      <template v-for="(row, index) of settingStore.weatherData.hourly">
        <li class="hours-item" v-if="index < 16" :key="row.time">
          <p class="d-elip">
            {{ dayjs(row.time).format("HH") }}时
          </p>
          <d-icon v-size="22" :icon="`icon-${weatherIconMap[row.cond_code as keyof typeof weatherIconMap] || 'qing'}`" />
          <p>{{ row.tmp }}°</p>
        </li>
      </template>
    </ul>
    <!-- 一周天气 -->
    <ul class="side-weather-week">
      <li
        class="week-item"
        v-for="row of settingStore.weatherData.daily_forecast"
        :key="row.date"
      >
        <span>{{
          ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
            dayjs(row.date).day()
          ]
        }}</span>
        <d-icon v-size="24" :icon="`icon-${weatherIconMap[row.cond_code_d as keyof typeof weatherIconMap] || 'qing'}`" />
        <span>{{ row.tmp_min }}~{{ row.tmp_max }}</span>
      </li>
    </ul>
    <ul class="side-weather-sun d-flex-between" v-if="settingStore.weatherData.sun">
      <li>日出: {{ settingStore.weatherData.sun.rise }}</li>
      <li>日落: {{ settingStore.weatherData.sun.set }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { useSettingStore } from '@/store/setting'
import { weatherIconMap } from '@/utils/constants'

const settingStore = useSettingStore()
</script>

<style lang='less' scoped>
.side-weather {
  overflow: hidden;
  background-color: #11132a;
  background-size: cover;
  color: #fff;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
.side-weather-box {
  padding-top: 20px;
  display: flex;
  .box-item {
    flex: 1;
    line-height: 24px;
  }
}
.side-weather-hours {
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: none;
  border-right: none;
  display: flex;
  font-size: 14px;
  line-height: 30px;
  padding: 10px;
  &::-webkit-scrollbar {
    height: 6px;
  }
  .hours-item {
    min-width: 40px;
    flex: 1;
  }
}
.side-weather-week {
  padding: 0 20px;
  .week-item {
    display: flex;
    font-size: 14px;
    line-height: 40px;
    align-items: center;
    justify-content: space-between;
  }
}
.side-weather-about {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.5);
}
.side-weather-sun {
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: none;
  border-right: none;
}
</style>

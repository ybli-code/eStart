<template>
  <div class="app-date-box ac">
    <div @click="toggleAppGroup" class="pointer time-container d-flex-column">
      <div class="time-wrapper d-flex-center">
        <span class="time-unit" :style="timeStyle">{{ timeHour }}</span>
        <span class="time-separator" :style="timeStyle">:</span>
        <span class="time-unit" :style="timeStyle">{{ timeMinute }}</span>
      </div>
      <p class="app-date" :style="dateStyle">
        {{ date }} 星期{{ week }}
        <span v-if="lunarDate" class="lunar-date ml10">{{ lunarDate }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from "dayjs"
import { Solar } from 'lunar-javascript'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

const timeHour = ref("")
const timeMinute = ref("")
const date = ref("")
const week = ref("")
const lunarDate = ref("")
let timer: any = null

const timeStyle = computed(() => {
  const size = settingStore.setContent.timeSize || 80
  return {
    fontSize: size + "px",
    fontWeight: settingStore.setContent.timeBold ? "bold" : "normal",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }
})

const dateStyle = computed(() => {
  const size = settingStore.setContent.timeSize || 80
  return {
    fontSize: Math.max(14, size * 0.24) + "px",
    fontWeight: settingStore.setContent.timeBold ? "bold" : "normal",
    marginTop: Math.max(4, size * 0.1) + "px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }
})

const toggleAppGroup = () => {
  (settingStore as any).hideAppGroup = !(settingStore as any).hideAppGroup
}

const getTime = () => {
  const weekMap: Record<number, string> = {
    1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 0: "日",
  }
  const now = dayjs()
  date.value = now.format("MM月DD日")
  timeHour.value = now.format("HH")
  timeMinute.value = now.format("mm")
  week.value = weekMap[now.day()]

  // Lunar date
  const solar = Solar.fromDate(new Date())
  const lunar = solar.getLunar()
  lunarDate.value = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
}

onMounted(() => {
  getTime()
  timer = setInterval(getTime, 1000 * 30)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="less" scoped>
.app-date-box {
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  user-select: none;
  margin: 40px 0;
  
  .time-container {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }

  .time-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .time-unit {
    display: inline-block;
    min-width: 1.2em;
  }

  .time-separator {
    margin: 0 0.1em;
    position: relative;
    top: -0.05em;
  }

  .app-date {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
    
    .lunar-date {
      font-size: 0.9em;
      opacity: 0.8;
    }
  }
}
</style>

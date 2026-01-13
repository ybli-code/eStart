/*
 * @Author: web.王晓冬
 * @Date: 2020-10-12 18:03:48
 * @LastEditors: www.itab.link
 * @LastEditTime: 2022-01-13 00:13:24
 * @Description: 设置-壁纸
*/
<template>
  <section class="set-section">
    <div class="d-flex-between align-center mb10">
      <h2 class="f16">壁纸</h2>
      <el-button type="text" size="small" @click="resetWallpaper">
        <el-icon><Refresh /></el-icon>
        重置默认
      </el-button>
    </div>
    <div v-if="activeSrc" class="wallpaper-status mb10 p10">
      <span class="f12 d-text-qgray">当前壁纸状态：</span>
      <el-tag size="small" type="success">已生效</el-tag>
    </div>
    <div v-else class="wallpaper-status mb10 p10">
      <span class="f12 d-text-qgray">当前壁纸状态：</span>
      <el-tag size="small" type="warning">未设置（使用默认）</el-tag>
    </div>
    <ul>
      <li class>
        对壁纸进行模糊处理
        <ul class="d-flex-between">
          <el-slider v-model="bgBlur" class="wfull"></el-slider>
          <span class="range-slider__value">
            <span>{{ bgBlur }}</span>
          </span>
        </ul>
      </li>
      <li>
        <div v-for="(item, index) of dataList" :key="index">
          <h3>{{ item.title }}</h3>
          <el-row :gutter="10">
            <el-col :span="8" v-for="(row, idx) of item.data" :key="idx">
              <div
                :title="`${row.title} ${row.local}`"
                @click="selWallpaper(row, 0)"
                class="wallpaper-item"
                :class="{ active: activeSrc == row.src }"
              >
                <el-image
                  fit="cover"
                  class="wallpaper-img"
                  :alt="row.title"
                  :src="row.src"
                  lazy
                ></el-image>
                <el-icon v-if="activeSrc == row.src" class="active-icon"><Check /></el-icon>
              </div>
            </el-col>
          </el-row>
        </div>
        <h3>必应</h3>
        <el-row :gutter="10">
          <el-col :span="8" v-for="(item, index) in displayList" :key="index">
            <div
              :title="`${item.title} ${item.copyright}`"
              class="wallpaper-item"
              @click="selWallpaper(item, 1)"
              :class="{ active: activeSrc == item.src }"
            >
              <el-image
                fit="cover"
                class="wallpaper-img"
                :alt="item.title"
                :src="item.src"
                lazy
              ></el-image>
              <el-icon v-if="activeSrc == item.src" class="active-icon"><Check /></el-icon>
            </div>
          </el-col>
        </el-row>
        
        <div style="text-align: center; margin: 10px 0;">
          <el-button 
            v-if="!isExpanded && (bingList.length > 3 || randomList.length > 0)" 
            type="text" 
            @click="toggleExpand"
            size="small">
            展开更多 <el-icon><ArrowDown /></el-icon>
          </el-button>
          
          <div v-if="isExpanded">
             <el-button 
               :loading="isLoading"
               type="primary" 
               plain
               size="small" 
               round
               @click="loadMoreRandom">
               加载更多随机壁纸
             </el-button>
             <el-button 
               type="text" 
               class="ml10"
               size="small" 
               @click="toggleExpand">
               收起 <el-icon><ArrowUp /></el-icon>
             </el-button>
          </div>
        </div>

        <h3 v-if="videoList && videoList.length > 0">动态</h3>
        <el-row :gutter="10" v-if="videoList && videoList.length > 0">
          <el-col :span="8" v-for="(row, index) of videoList" :key="index">
            <div
              :title="`${row.title} ${row.local}`"
              class="wallpaper-item"
              @click="selWallpaper(row, 2)"
              :class="{ active: activeSrc == row.src }"
            >
              <video :alt="row.title" :src="row.src" />
              <el-icon v-if="activeSrc == row.src" class="active-icon"><Check /></el-icon>
            </div>
          </el-col>
        </el-row>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, ArrowDown, ArrowUp, Check } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/setting'
import api from "@/api"
import { videoList, imgList } from "@/json"

const settingStore = useSettingStore()

const dataList = [
  {
    title: "默认",
    data: imgList,
  },
]

const activeSrc = ref(settingStore.wallpaper.src || "")
const bingList = ref<any[]>([])
const randomList = ref<any[]>([])
const isExpanded = ref(false)
const isLoading = ref(false)

const displayList = computed(() => {
  if (!isExpanded.value) {
    return bingList.value.slice(0, 3)
  }
  return [...bingList.value, ...randomList.value]
})

const bgBlur = computed({
  get() {
    return settingStore.setContent.bgBlur
  },
  set(val: number) {
    settingStore.setSetContent({ bgBlur: val })
  }
})

const getBingList = () => {
  api.getBingWallpaperList().then((res: any) => {
    if (res.code === 200) {
      bingList.value = res.data
    }
  })
}

const selWallpaper = (row: any, type: number) => {
  row.type = type
  activeSrc.value = row.src
  settingStore.setWallpaper(row)
}

const resetWallpaper = () => {
  const defaultWallpaper = imgList[0]
  selWallpaper(defaultWallpaper, 0)
  ElMessage.success('已恢复默认壁纸')
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const loadMoreRandom = () => {
  isLoading.value = true
  api.getBingRandomWallpaper().then((res: any) => {
    isLoading.value = false
    if (res.code === 200) {
      randomList.value.push(...res.data)
    }
  }).catch(() => {
    isLoading.value = false
    ElMessage.error('加载壁纸失败，请稍后再试')
  })
}

onMounted(() => {
  getBingList()
})
</script>
<style lang='less' scoped>
.wallpaper-item {
  cursor: pointer;
  position: relative;
  background: #000;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  height: 60px;
  .active-icon {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    color: #fff;
    font-size: 24px;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wallpaper-img,
  video {
    width: 100%;
    height: 100%;
    transition: 0.2s;
    display: block;
  }
  &:hover {
    .wallpaper-img,
    video {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
}
.bing-copyright {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
</style>
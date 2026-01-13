<template>
  <div @contextmenu.prevent="doNothing" class="app-box" :class="themeMode">
    <div class="app-bg" :style="{ filter: `blur(${settingStore.setContent.bgBlur}px)` }">
      <video
        v-if="wallpaper.type == 2"
        class="app-bg-video"
        autoplay
        loop
        muted
        :src="wallpaper.src"
        @error="videoError"
      ></video>
      <div v-else class="app-bg-img" :style="{ backgroundImage: `url(${wallpaper.src})` }"></div>
    </div>

    <div class="app-cover">
      <el-tooltip placement="top" v-if="wallpaper.copyright || wallpaper.title">
        <template #content>
          <div>
            {{ wallpaper.title || wallpaper.copyright }}
            <br />
            <d-icon v-size="12" icon="icon-local" v-if="wallpaper.local">
              {{ wallpaper.local }}
            </d-icon>
          </div>
        </template>
        <d-icon v-size="24" icon="icon-about" class="wallpaper-info"></d-icon>
      </el-tooltip>
      <Home />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import Home from "@/views/home.vue"
import { imgList } from "@/json"
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

const wallpaper = computed(() => {
  const defaultWallpaper = { ...imgList[0], type: 0 }
  if (settingStore.wallpaper && settingStore.wallpaper.src) {
    return settingStore.wallpaper
  }
  return defaultWallpaper
})

const themeMode = computed(() => {
  if (settingStore.setContent.sunrise) {
    return settingStore.moment === 'd' ? 'light' : 'dark'
  }
  return settingStore.setContent.themeMode
})

watch(themeMode, (val) => {
  if (val) {
    document.querySelector("html")?.setAttribute('class', val)
  }
}, { immediate: true })

onMounted(() => {
  if (themeMode.value) {
    document.querySelector("html")?.setAttribute('class', themeMode.value)
  }
})

const doNothing = () => {
  // Prevent default is handled by @contextmenu.prevent
}

const videoError = () => {
  settingStore.setWallpaper({ ...imgList[0], type: 0 })
}
</script>

<style lang="less" scoped>
.app-box {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #333;
  overflow: hidden;

  .app-bg {
    position: absolute;
    backface-visibility: hidden;
    transition-duration: 0.2s;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;

    .app-bg-img,
    .app-bg-video {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: 0.3s;
    }
    .app-bg-img {
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    &.bgBlur {
      filter: blur(10px);
      transform: scale(1.042);
    }
  }
  .app-cover {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
.wallpaper-info {
  position: absolute;
  transition-duration: 0.2s;
  color: rgba(255, 255, 255, 0.2);
  right: 10%;
  bottom: 10%;
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
}
</style>

<template>
  <div class="d-flex-hor">
    <div
      class="app-group"
      @wheel="mousewheelHandle"
      :class="{ zoomIn: settingStore.setContent.startAnimation }"
    >
      <el-carousel
        ref="elCarousel"
        arrow="never"
        :height="carouselHeight"
        :autoplay="false"
        :initial-index="settingStore.initialIndex"
        indicator-position="outside"
        :class="`layout-col-${layout[0]} layout-row-${layout[1]}`"
        @change="carouselChange"
      >
        <el-carousel-item v-for="(groupRow, pageIndex) in settingStore.navList" :key="pageIndex">
          <draggable
            v-model="settingStore.navList[pageIndex]"
            v-bind="dragOptions"
            filter=".icon-item-handle"
            item-key="id"
            class="app-group-page"
          >
            <template #item="{ element: item }">
              <div
                class="app-group-item"
                :class="[{ swing: isEdit }, { scaleOut: item.delete }]"
              >
                <div
                  class="group-item-content"
                  @contextmenu.prevent="isEdit = true"
                  v-size="settingStore.setContent.iconSize"
                  :title="item.title"
                >
                  <!-- 图标操作 -->
                  <div class="icon-item-handle" v-if="item.key != 'add'">
                    <p
                      @click.stop="delHandle(item)"
                      class="icon-item-delete d-flex-center"
                    >
                      <d-icon v-size="16" icon="icon-close" />
                    </p>
                    <p
                      @click="editHandle(item)"
                      class="icon-item-edit d-flex-center"
                      :style="{ borderRadius: `${settingStore.setContent.iconRadius / 2}%` }"
                    >
                      <d-icon v-size="34" icon="icon-edit" />
                    </p>
                  </div>
                  <!-- 有可能是天气 -->
                  <div
                    @click.stop="urlTo(item)"
                    class="group-weather group-item-icon"
                    :style="{
                      borderRadius: `${settingStore.setContent.iconRadius / 2}%`,
                      backgroundColor: `rgba(var(--background), ${settingStore.setContent.iconOpacity / 100})`
                    }"
                    v-if="item.key == 'weather'"
                  >
                    <d-icon
                      v-size="'100%'"
                      :icon="`icon-${weatherIconMap[settingStore.weatherData.now.cond_code] || 'qing'}`"
                    />
                    <p class="group-weather-info">
                      {{ settingStore.weatherData.location }} {{ settingStore.weatherData.now.cond_txt }}
                      {{ settingStore.weatherData.now.tmp }}°
                    </p>
                  </div>
                  <!-- 默认图标 -->
                  <div
                    @click.stop="urlTo(item)"
                    v-else
                    class="group-item-icon d-flex-center"
                    :style="{
                      backgroundColor: item.bgColor || `rgba(var(--background), ${settingStore.setContent.iconOpacity / 100})`,
                      borderRadius: `${settingStore.setContent.iconRadius / 2}%`,
                      fontSize: `${adaptiveIconSize}px`,
                      color: item.color || '#fff'
                    }"
                  >
                    <d-icon v-if="item.iconName" v-size="'1.2em'" :icon="item.iconName" />
                    <span v-else>{{ item.title?.charAt(0) }}</span>
                  </div>
                  <p class="group-item-title">{{ item.title }}</p>
                </div>
              </div>
            </template>
          </draggable>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { useSettingStore } from '@/store/setting'
import { weatherIconMap } from '@/utils/constants'

const settingStore = useSettingStore()
const isEdit = ref(false)
const elCarousel = ref<any>(null)

const layout = ref([3, 6]) // Default layout rows and cols

const adaptiveIconSize = computed(() => {
  const size = settingStore.setContent.iconSize || 60
  return size * 0.5
})

const carouselHeight = computed(() => {
  return `${(adaptiveIconSize.value + 100) * layout.value[0]}px`
})

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}

const mousewheelHandle = (e: WheelEvent) => {
  if (e.deltaY > 0) {
    elCarousel.value?.next()
  } else {
    elCarousel.value?.prev()
  }
}

const carouselChange = (index: number) => {
  settingStore.setInitialIndex(index)
}

const urlTo = (item: any) => {
  if (isEdit.value) return
  if (item.url) {
    window.open(item.url, '_blank')
  } else if (item.key === 'add') {
    settingStore.setShowSide({ val: true, comp: 'add' })
  } else if (item.key === 'setting') {
    settingStore.setShowSide({ val: true, comp: 'setting' })
  }
}

const delHandle = (item: any) => {
  // Logic to delete item from navList
}

const editHandle = (item: any) => {
  // Logic to edit item
}

// Close edit mode on global click
window.addEventListener('click', () => {
  isEdit.value = false
})
</script>

<style lang="less" scoped>
.app-group {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.app-group-page {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  padding: 20px;
}
.app-group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  &.swing {
    animation: swing 0.3s infinite;
  }
}
.group-item-content {
  position: relative;
  cursor: pointer;
  .group-item-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  }
  .group-item-title {
    margin-top: 10px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }
}
.icon-item-handle {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 10;
  display: flex;
  gap: 5px;
  .icon-item-delete {
    background: #f56c6c;
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
  }
}

@keyframes swing {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}
</style>

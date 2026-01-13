<template>
  <div class="default-nav">
    <el-input
      class="p5"
      maxlength="10"
      clearable
      placeholder="请输入网站名称"
      v-model="queryForm.name"
      size="small"
      @clear="queryHandle"
      @keyup.enter="queryHandle"
    >
      <template #prefix>
        <el-icon class="el-input__icon d-block" @click="queryHandle()"><Search /></el-icon>
      </template>
    </el-input>
    <div class="d-flex">
      <ul class="class-box d-elip">
        <li class="pl20" @click="tabClick({ type: -1 })" :class="{ active: tabActive == -1 }">常用网站</li>
        <li
          @click="tabClick(item)"
          :class="{ active: tabActive == item.type }"
          v-for="item of categoryData"
          :key="item.type"
        >{{ item.name }}</li>
      </ul>
      <div
        class="default-box"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="tabActive == -1"
      >
        <div
          class="app-group layout-row-2 p0 mt0"
          style="width: auto; margin-top: -20px"
          v-loading="loading"
        >
          <div class="ac" v-if="!defaultNavList.length">暂无数据</div>
          <template v-for="(row, index) of defaultNavList" :key="index">
            <div class="app-group-item mb10" v-if="row.key != 'add'">
              <div class="group-item-content" v-size="80">
                <!-- 图标 -->

                <el-icon
                  @click.stop="selNav(row)"
                  v-show="!navListIds.includes(row.id)"
                  class="icon-item unselect"
                ><CircleCheck /></el-icon>
                <el-icon
                  @click.stop="selNav(row)"
                  v-show="navListIds.includes(row.id)"
                  class="icon-item select"
                ><CircleCheckFilled /></el-icon>

                <div
                  @click.stop="urlTo(row)"
                  class="group-item-icon d-flex-center d-hidden"
                  v-font="settingStore.setContent.iconSize"
                  :style="{
                    backgroundColor: row.bgColor || `rgba(var(--background),${settingStore.setContent.iconOpacity / 100})`,
                    borderRadius: `${settingStore.setContent.iconRadius / 2}%`,
                  }"
                >
                  <el-tooltip v-if="row.type == 2" effect="dark" placement="top">
                    <template #content>
                      <div style="max-width: 300px">{{ row.description || row.title }}</div>
                    </template>
                    <img v-size="row.source ? '100%' : '38%'" :src="row.icon" :alt="row.title" />
                  </el-tooltip>
                  <d-icon 
                    v-else 
                    :style="{
                      width: row.bgColor ? '60%' : '40%',
                      height: row.bgColor ? '60%' : '40%',
                      fontSize: row.bgColor ? '0.6em' : '0.4em'
                    }"
                    v-color="row.color || (row.bgColor ? '#fff' : '')" 
                    :icon="row.iconName || `icon-${row.key}`" 
                  />
                </div>
                <p
                  class="group-item-title f12 d-elip"
                  style="padding: 0"
                  :title="row.title"
                  :style="{ color: `rgba(var(--main-color),.8)` }"
                >
                  <span>{{ row.title }}</span>
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { navList } from "@/json"
import { useSettingStore } from '@/store/setting'
import { Search, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue'

const settingStore = useSettingStore()

const queryForm = reactive({
  name: ''
})
const tabActive = ref(-1)
const loading = ref(false)
const categoryData = ref<any[]>([])
const defaultNavList = ref<any[]>([...navList])

const navListIds = computed(() => {
  return settingStore.navList.flat().map((row: any) => row.id)
})

const tabClick = (item: any) => {
  tabActive.value = item.type
  queryHandle()
}

const queryHandle = () => {
  loading.value = true
  setTimeout(() => {
    let list = [...navList]
    if (queryForm.name) {
      list = list.filter(item => item.title.includes(queryForm.name))
    }
    if (tabActive.value !== -1) {
      list = list.filter(item => item.type === tabActive.value)
    }
    defaultNavList.value = list
    loading.value = false
  }, 300)
}

const loadMore = () => {
  // Logic to load more if needed
}

const selNav = (row: any) => {
  const newNavList = [...settingStore.navList]
  const flattened = newNavList.flat()
  const index = flattened.findIndex(item => item.id === row.id)
  
  if (index > -1) {
    // Remove
    for (let i = 0; i < newNavList.length; i++) {
      const itemIndex = newNavList[i].findIndex(item => item.id === row.id)
      if (itemIndex > -1) {
        newNavList[i].splice(itemIndex, 1)
        if (newNavList[i].length === 0) {
          newNavList.splice(i, 1)
        }
        break
      }
    }
  } else {
    // Add
    if (newNavList.length === 0) {
      newNavList.push([row])
    } else {
      newNavList[0].push(row)
    }
  }
  settingStore.setNavList(newNavList)
}

const urlTo = (row: any) => {
  if (row.url) {
    window.open(row.url, '_blank')
  }
}

onMounted(() => {
  queryHandle()
})
</script>

<style lang='less' scoped>
.default-nav {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.class-box {
  width: 100px;
  list-style: none;
  padding: 0;
  margin: 0;
  border-right: 1px solid rgba(var(--main-color), 0.1);
  li {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    font-size: 14px;
    color: rgba(var(--main-color), 0.6);
    &.active {
      color: var(--primary-color);
      background: rgba(var(--primary-color), 0.1);
      border-right: 2px solid var(--primary-color);
    }
  }
}
.default-box {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
.icon-item {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  font-size: 18px;
  cursor: pointer;
  &.unselect {
    color: rgba(var(--main-color), 0.2);
  }
  &.select {
    color: var(--primary-color);
  }
}
</style>
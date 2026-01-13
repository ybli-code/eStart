<template>
  <div class="side-add">
    <d-tabs
      class="d-flex-between"
      v-model="tabIndex"
      :data="['默认', '自定义']"
    />
    <!-- 默认捷径 -->
    <defaults v-show="tabIndex == 0" />

    <!-- 自定义添加捷径 -->
    <div class="mt20 pl20 pr20" v-show="tabIndex == 1">
      <div>
        <input
          @input="getIcon"
          class="add-input"
          v-model.trim="addForm.title"
          maxlength="20"
          placeholder="标题"
          type="text"
        />
        <input
          class="add-input"
          v-model.trim="addForm.url"
          placeholder="网址"
          @input="getIcon"
          type="text"
        />
        <p style="color: #e74c3c" class="f12">{{ tips }}</p>
        <div class="app-group mb20 d-flex-ver" style="width: auto">
          <div class="app-group-item mt0" style="width: auto">
            <div class="group-item-content" v-size="settingStore.setContent.iconSize">
              <!-- 图标 -->

              <div
                class="group-item-icon d-flex-center"
                :style="[
                  {
                    backgroundColor: `${
                      addForm.bgColor
                        ? addForm.bgColor
                        : `rgba(var(--background),${
                            settingStore.setContent.iconOpacity / 100
                          })`
                    }`,
                  },
                  { borderRadius: `${settingStore.setContent.iconRadius / 2}%` },
                  { fontSize: `${settingStore.setContent.iconSize}px` },
                ]"
              >
                <span
                  v-if="addForm.type == 2 && addForm.iconType == 'text'"
                  :style="{ color: addForm.bgColor ? '#fff' : '' }"
                  class="group-item-icon-font"
                  >{{ addForm.icon }}</span
                >
                <img
                  v-else-if="addForm.type == 2"
                  @error="imgError"
                  v-size="'36%'"
                  :src="addForm.icon"
                  alt=""
                />
                <d-icon
                  v-else
                  :style="{
                    width: addForm.bgColor ? '60%' : '40%',
                    height: addForm.bgColor ? '60%' : '40%',
                    fontSize: addForm.bgColor ? '0.6em' : '0.4em'
                  }"
                  v-color="addForm.color || (addForm.bgColor ? '#fff' : '')"
                  :icon="addForm.iconName || `icon-${addForm.key}`"
                />
              </div>
            </div>
          </div>
          <div class="add-icon-info ml10">
            输入完整链接后会自动获取网站图标<br />
            如果图标获取失败会以标题前两个字符作为名称
          </div>
        </div>
        <ul class="add-color d-pointer d-flex-between">
          <li
            class="add-color-item"
            @click="selBgColor(item)"
            v-for="item of colorList"
            :class="[
              `color-item-select-${item == addForm.bgColor ? true : false}`,
              `color-item-${item}`,
            ]"
            :key="item"
            :style="[{ backgroundColor: item }, { borderColor: item }]"
          ></li>
        </ul>
        <el-button type="primary" class="wfull mt20" @click="submit">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import dayjs from "dayjs"
import defaults from "./add/default.vue"
import { useSettingStore } from '@/store/setting'
import { ElMessage } from 'element-plus'

const settingStore = useSettingStore()

const tabIndex = ref(0)
const colorList = [
  "",
  "#1abc9c",
  "#2ecc71",
  "#33c5c5",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
]
const tips = ref("")
const addForm = reactive({
  title: "",
  url: "",
  bgColor: "",
  type: 2,
  icon: "",
  iconType: "text",
  color: "",
  key: "",
  id: "",
})

const isURL = (domain: string) => {
  const name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
  return name.test(domain)
}

const formatUrl = (url: string) => {
  if (
    url.toLowerCase().startsWith("http://") ||
    url.toLowerCase().startsWith("https://")
  ) {
    return url
  }
  return "http://" + url
}

const init = (val: any) => {
  if (settingStore.editType === 'edit') {
    tabIndex.value = 1
  } else {
    tabIndex.value = 0
  }
  // Logic to initialize form if needed
}

const getIcon = () => {
  if (isURL(addForm.url)) {
    const url = formatUrl(addForm.url)
    const domain = url.split('/')[2]
    addForm.icon = `https://api.iowen.cn/favicon/${domain}.png`
    addForm.iconType = 'img'
  } else if (addForm.title) {
    addForm.icon = addForm.title.substring(0, 2)
    addForm.iconType = 'text'
  }
}

const imgError = () => {
  if (addForm.title) {
    addForm.icon = addForm.title.substring(0, 2)
    addForm.iconType = 'text'
  }
}

const selBgColor = (item: string) => {
  addForm.bgColor = item
}

const submit = () => {
  if (!addForm.title) {
    tips.value = "请输入标题"
    return
  }
  if (!addForm.url) {
    tips.value = "请输入网址"
    return
  }
  
  const newItem = {
    ...addForm,
    id: addForm.id || dayjs().valueOf().toString(),
    url: formatUrl(addForm.url)
  }

  const newNavList = [...settingStore.navList]
  if (settingStore.editType === 'edit') {
    // Find and update
    for (let i = 0; i < newNavList.length; i++) {
      const index = newNavList[i].findIndex(item => item.id === newItem.id)
      if (index > -1) {
        newNavList[i][index] = newItem
        break
      }
    }
  } else {
    // Add to first page or create new page
    if (newNavList.length === 0) {
      newNavList.push([newItem])
    } else {
      // Find a page with space or add to last page
      // For simplicity, add to first page for now, or handle pagination
      newNavList[0].push(newItem)
    }
  }

  settingStore.setNavList(newNavList)
  settingStore.setShowSide({ val: false })
  ElMessage.success(settingStore.editType === 'edit' ? "修改成功" : "添加成功")
}

watch(() => settingStore.navRowData, (val) => {
  if (val) {
    Object.assign(addForm, val)
    init(val)
  }
}, { deep: true, immediate: true })

watch(() => settingStore.showSide, (val) => {
  if (!val) {
    // Reset form when side closed? 
    // Usually handled by the component that opens it
  }
})
</script>

<style lang="less" scoped>
.side-add {
  padding: 20px;
}
.add-input {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  margin-bottom: 20px;
  border: 1px solid rgba(var(--main-color), 0.1);
  background: rgba(var(--main-color), 0.05);
  color: rgba(var(--main-color), 1);
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: var(--primary-color);
  }
}
.add-color {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.add-color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  &.color-item-select-true {
    border-color: #fff;
    box-shadow: 0 0 0 1px var(--primary-color);
  }
}
.add-icon-info {
  font-size: 12px;
  color: rgba(var(--main-color), 0.6);
  line-height: 1.6;
}
.group-item-icon-font {
  font-size: 0.5em;
  font-weight: bold;
}
.color-item- {
  background-size: 35%;
  background-image: url("@/assets/transparent.png");
  border-color: #666 !important;
}
</style>
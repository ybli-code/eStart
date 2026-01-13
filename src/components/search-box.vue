<template>
  <div class="d-flex-hor">
    <div class="app-serach-box">
      <div class="se-input-box" :class="{ active: value }">
        <div class="se-select" @click.stop="isShowSelect = !isShowSelect">
          <d-icon v-size="20" :icon="`icon-${currSearch.icon}`"></d-icon>
        </div>
        <input
          v-model.trim="value"
          class="se-input"
          @input="keyWordList"
          @keyup.enter="searchHandle(value)"
          @keydown="keydown"
          placeholder="输入并搜索"
          type="text"
        />
        <div class="se-close" v-show="value" @click="value = ''">
          <d-icon v-size="20" icon="icon-clost" class="select-icon"></d-icon>
        </div>
        <div class="se-select" @click="searchHandle(value)">
          <d-icon v-size="20" icon="icon-search" class="select-icon"></d-icon>
        </div>
      </div>
      <div class="se-list-keyword">
        <ul class="se-all" :class="{ action: isShowSelect }">
          <li
            class="se-item"
            v-for="(item, index) of searchList"
            :key="item.key"
            :title="item.title"
          >
            <span
              @click.stop="clickSelect(item)"
              class="se-item-icon"
              :style="{ transition: `${0.2 * (index + 1)}s` }"
              :class="{ action: item.key == currSearch.key }"
            >
              <d-icon v-size="18" :icon="`icon-${item.icon}`"></d-icon>
            </span>
          </li>
        </ul>
        <ul class="se-keyword al" v-if="value && showKeyWord" :style="{ height: keyListHeight }">
          <li
            @click.stop="searchHandle(tranText, 'fanyi')"
            class="se-keyword-item d-elip"
            :class="{ focus: keyIndex === 0 }"
          >翻译：{{ tranText }}</li>
          <li
            @click.stop="searchHandle(item)"
            class="se-keyword-item d-elip"
            v-for="(item, index) of keyList"
            :class="{ focus: keyIndex == index + 1 }"
            :key="item"
          >{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

const value = ref("")
const isShowSelect = ref(false)
const showKeyWord = ref(false)
const keyIndex = ref(-1)
const keyList = ref<string[]>([])
const tranText = ref("")

const searchList = [
  {
    key: "baidu",
    title: "百度搜索",
    icon: "baidu",
    href: "http://www.baidu.com/s?wd=",
    translate: "https://fanyi.baidu.com/translate?#zh/en/",
  },
  {
    key: "bing",
    title: "必应搜索",
    icon: "bing",
    href: "https://cn.bing.com/search?q=",
    translate: "https://fanyi.baidu.com/translate?#zh/en/",
  },
  {
    key: "google",
    title: "google搜索",
    icon: "google",
    href: "https://www.google.com/search?q=",
    translate: "https://translate.google.com/#view=home&op=translate&sl=en&tl=zh-CN&text=",
  },
]

const currSearch = ref(searchList[0])

const keyListHeight = computed(() => {
  return (keyList.value.length + 1) * 35 + 'px'
})

const clickSelect = (item: any) => {
  currSearch.value = item
  isShowSelect.value = false
}

const keyWordList = () => {
  if (!value.value) {
    keyList.value = []
    showKeyWord.value = false
    return
  }
  
  tranText.value = value.value
  
  // Use JSONP for Baidu suggestion (demo purpose, real implementation might need proxy)
  axios.get(`https://suggestion.baidu.com/su?wd=${value.value}&cb=window.baidu.sug`, {
    adapter: 'jsonp' as any
  }).catch(() => {
    // Basic fallback for demo
    keyList.value = ['Search suggestion 1', 'Search suggestion 2']
    showKeyWord.value = true
  })
}

const searchHandle = (val: string, type?: string) => {
  if (!val) return
  let url = currSearch.value.href + encodeURIComponent(val)
  if (type === 'fanyi') {
    url = currSearch.value.translate + encodeURIComponent(val)
  }
  window.open(url, '_blank')
}

const keydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    keyIndex.value++
    if (keyIndex.value > keyList.value.length) keyIndex.value = 0
  } else if (e.key === 'ArrowUp') {
    keyIndex.value--
    if (keyIndex.value < 0) keyIndex.value = keyList.value.length
  }
}

onMounted(() => {
  // Global click to close search select
  window.addEventListener('click', () => {
    isShowSelect.value = false
  })
})
</script>

<style lang="less" scoped>
.app-serach-box {
  width: 560px;
  position: relative;
  margin: 0 auto;
  z-index: 10;
}
.se-input-box {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 5px;
  transition: all 0.3s;
  &.active, &:hover {
    background: rgba(255, 255, 255, 0.9);
    .se-input {
      color: #333;
    }
    .select-icon {
      color: #666;
    }
  }
}
.se-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 15px;
  font-size: 16px;
  color: #fff;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}
.se-select, .se-close {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
}
.se-list-keyword {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 10px;
}
.se-all {
  display: flex;
  justify-content: center;
  padding: 0;
  list-style: none;
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
  transition: all 0.3s;
  &.action {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .se-item {
    margin: 0 10px;
    .se-item-icon {
      display: block;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      &.action {
        background: #409eff;
      }
    }
  }
}
.se-keyword {
  background: #fff;
  border-radius: 15px;
  padding: 10px 0;
  list-style: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  .se-keyword-item {
    padding: 10px 20px;
    cursor: pointer;
    &:hover, &.focus {
      background: #f5f7fa;
    }
  }
}
</style>

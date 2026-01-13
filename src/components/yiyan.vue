<template>
  <div class="app-yiyan ac">
    <div
      class="yiyan-text f12"
      @click="copyText(yiyan.hitokoto)"
      @contextmenu.prevent="yiyanHandle"
      title="点击左键复制，右键切换"
    >
      「 {{ yiyan.hitokoto }} 」
    </div>
    <div class="yiyan-from f12">--{{ yiyan.from }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { ElMessage } from 'element-plus'

interface YiyanData {
  hitokoto: string
  from: string
}

const yiyan = ref<YiyanData>({
  hitokoto: '',
  from: ''
})

const getYiyan = async () => {
  try {
    const res = await api.getYiyan()
    yiyan.value = res || { hitokoto: '', from: '' }
  } catch (error) {
    console.error(error)
  }
}

const yiyanHandle = () => {
  getYiyan()
}

const copyText = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success("一言已复制到剪切板")
  }).catch(() => {
    ElMessage.error("复制失败")
  })
}

onMounted(() => {
  getYiyan()
})
</script>

<style lang='less' scoped>
.app-yiyan {
  overflow: hidden;
  cursor: pointer;
  max-height: 60px;
  padding: 10px 0;
  transition: 0.3s;
  line-height: 20px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.9);
  .yiyan-text {
    text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  }
  .yiyan-from {
    opacity: 0;
    transition: 0.4s;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    backdrop-filter: blur(1px);
    .yiyan-from {
      opacity: 1;
    }
  }
}
.ac {
  text-align: center;
}
.f12 {
  font-size: 12px;
}
</style>

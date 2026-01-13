<!--
 * @Author: web.王晓冬
 * @Date: 2020-10-12 18:03:48
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2020-12-04 14:47:33
 * @Description: setting 设置
-->
<template>
  <div class="side-comp-box">
    <!-- 账号与备份 -->
    <user />
    <!-- 外观 -->
    <theme />
    <!-- 外观 -->
    <exterior />
    <!-- 壁纸 -->
    <wallpaper />
    <section class="set-section mt20">
      <ul>
        <li class="d-flex-between">
          初始化设置

          <el-button size="small" type="primary" @click="resetSet"
            >重置</el-button
          >
        </li>
      </ul>
    </section>
    <!-- 关于我 -->
    <about />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import user from "./user.vue"
import exterior from "./exterior.vue"
import wallpaper from "./wallpaper.vue"
import theme from "./theme.vue"
import about from "./about.vue"
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

const resetSet = () => {
  ElMessageBox.confirm(
    "此操作将清空您的喜好设置! 您的便笺和待办事项不会清空, 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    }
  ).then(() => {
    // Reset setting store logic would go here if needed
    // For now, just mimicking the existing logic which was just a message
    ElMessage.success("重置成功!")
  }).catch(() => {
    // Cancelled
  })
}
</script>

<style lang='less'>
.side-comp-box {
  padding: 0 20px 10px;
  background-color: var(--background-info);
  font-size: 14px;
  height: 100%;
  width: 100%;

  .set-section {
    color: rgba(var(--main-color), 0.7);
    line-height: 30px;
    & > ul {
      background-color: rgba(var(--main-color), 0.05);
      padding: 10px;
      border-radius: 5px;
    }
    h3 {
      color: rgba(var(--main-color), 1);
    }
    h2 {
      color: rgba(var(--main-color), 1);
      line-height: 50px;
      font-size: 16px;
    }
  }
}
</style>

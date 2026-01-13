/*
 * @Author: web.王晓冬
 * @Date: 2020-10-15 21:52:45
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2020-12-07 17:00:49
 * @Description: setting 主题
*/
<template>
  <div>
    <section class="set-section">
      <h2>账号与备份</h2>
      <ul v-if="userInfo && Object.keys(userInfo).length">
        <li>
          <el-button type="text">{{
            userInfo.userInfo ? userInfo.userInfo.account : userInfo.account
          }}</el-button>
          <el-button class="fr" type="primary" size="small" @click="logout"
            >退出登陆</el-button
          >
        </li>

        <li>
          <el-button type="text" @click="bakHandle">手动备份数据</el-button>
        </li>
      </ul>
      <ul v-else>
        <li>
          <el-button
            class="wfull"
            size="default"
            type="primary"
            @click="loginHandle('login')"
            >登录</el-button
          >
        </li>
        <li class="mt10">
          <el-button
            class="wfull"
            type="text"
            size="default"
            @click="loginHandle('reg')"
            >注册</el-button
          >
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo || {})

const loginHandle = (type: 'login' | 'reg') => {
  userStore.setLoginInfo({
    visible: true,
    type: type,
  })
}

const logout = () => {
  ElMessage.success("退出成功")
  userStore.logout()
}

// 手动备份
const bakHandle = () => {
  // TODO: 待实现备份逻辑
  ElMessage.info('备份功能开发中...')
}
</script>
<style lang='less' scoped>
.login-tip {
  font-size: 12px;
  margin-bottom: 20px;
  color: rgba(var(--main-color), 0.5);
}
</style>
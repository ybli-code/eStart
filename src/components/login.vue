<!--
 * @Author: web.王晓冬
 * @Date: 2020-10-15 21:52:45
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2020-12-07 16:43:44
 * @Description: 注册
-->
<template>
  <div>
    <el-dialog
      :title="loginInfo.type === 'reg' ? '注册' : '欢迎使用'"
      width="420px"
      v-model="visible"
    >
      <div class="pl20 pr20">
        <p class="login-tip">
          {{ loginInfo.type == "reg" ? "注册" : "登录" }}后可实现数据备份等功能
        </p>
        <el-form :model="loginForm" ref="loginFormRef" label-position="right">
          <el-form-item
            prop="loginName"
            :rules="{ required: true, message: '账号不能为空' }"
          >
            <el-input
              maxlength="18"
              v-model="loginForm.loginName"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="{ required: true, message: '密码不能为空' }"
          >
            <el-input
              show-password
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              @keyup.enter="loginOrRegHandle"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="notarize"
            v-if="loginInfo.type == 'reg'"
            :rules="{ required: true, message: '密码确认不能为空' }"
          >
            <el-input
              show-password
              type="password"
              v-model="loginForm.notarize"
              placeholder="请确认密码"
            ></el-input>
          </el-form-item>
          <el-button
            @click="loginOrRegHandle"
            type="primary"
            class="wfull mb50 mt20"
            :loading="loading"
          >
            立即{{ loginInfo.type == "reg" ? "注册" : "登录" }}
          </el-button>
        </el-form>

        <div class="ac mt20" v-if="loginInfo.type == 'login'">
          还没有账号？<el-button type="text" @click="loginHandle('reg')">立即注册</el-button>
        </div>
        <div class="ac mt20" v-if="loginInfo.type == 'reg'">
          已有账号？<el-button type="text" @click="loginHandle('login')">立即登陆</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { encode } from "js-base64"
import { useUserStore } from '@/store/user'
import { useSettingStore } from '@/store/setting'
import api from '@/api'
import { ElMessage, type FormInstance } from 'element-plus'

const userStore = useUserStore()
const settingStore = useSettingStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const loginForm = reactive({
  loginName: "",
  password: "",
  notarize: "", //确认密码
})

const loginInfo = computed(() => userStore.loginInfo)

const visible = computed({
  get: () => userStore.loginInfo.visible,
  set: (val) => {
    userStore.setLoginInfo({ visible: val })
  }
})

const loginHandle = (type: 'login' | 'reg') => {
  userStore.setLoginInfo({
    visible: true,
    type: type,
  })
}

// 登陆注册
const loginOrRegHandle = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    let type: 'login' | 'register' = 'login'
    
    if (loginInfo.value.type === 'reg') {
      if (loginForm.password !== loginForm.notarize) {
        ElMessage.error("两次输入的密码不一致,请重新输入")
        loading.value = false
        return
      }
      type = 'register'
    }

    const params = {
      account: loginForm.loginName,
      password: encode(loginForm.password)
    }

    try {
      const res: any = await (api as any)[type](params)
      if (res.code !== 200) return
      
      ElMessage.success(`${type === 'login' ? '登陆' : '注册'}成功`)
      
      // 用户信息保存到本地
      userStore.setUserInfo(res.data)
      
      // 关闭弹出框
      userStore.setLoginInfo({
        visible: false
      })
      
      // 登录成功后初始化配置 (这里假设 settingStore 有 initSetting 方法)
      // 如果没有，可能需要调用 api.configInfoCurInfo
      if ((settingStore as any).initSetting) {
        (settingStore as any).initSetting()
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang='less' scoped>
.login-tip {
  font-size: 12px;
  margin-bottom: 20px;
  color: rgba(var(--main-color), 0.5);
}
.wfull {
  width: 100%;
}
.ac {
  text-align: center;
}
.mt20 {
  margin-top: 20px;
}
.mb50 {
  margin-bottom: 50px;
}
.pl20 {
  padding-left: 20px;
}
.pr20 {
  padding-right: 20px;
}
</style>

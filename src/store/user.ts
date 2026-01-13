import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as any,
    token: '' as string,
    loginInfo: {
      visible: false,
      type: 'login' as 'login' | 'reg'
    }
  }),
  actions: {
    setUserInfo(info: any) {
      this.userInfo = info
      this.token = info?.token || ''
    },
    setLoginInfo(payload: { visible: boolean, type?: 'login' | 'reg' }) {
      this.loginInfo.visible = payload.visible
      if (payload.type) {
        this.loginInfo.type = payload.type
      }
    },
    logout() {
      this.userInfo = null
      this.token = ''
    },
  },
  persist: true,
})

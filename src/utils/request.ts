import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import pinia from '@/store'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore(pinia)
    if (userStore.token) {
      if (config.headers) {
        config.headers['token'] = userStore.token
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 如果返回的是二进制数据则直接返回
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response
    }
    
    if (res.code === 500) {
      ElMessage.error(res.msg || '服务器内部错误')
      return Promise.reject(new Error(res.msg || 'Error'))
    } else if (res.code === 400) {
      ElMessage.error('登录已过期，请重新登录')
      const userStore = useUserStore(pinia)
      userStore.logout()
      return Promise.reject(new Error('Login expired'))
    }
    return res
  },
  (error) => {
    console.error('API Error:', error)
    if (!error.response) {
      ElMessage.warning('无法连接到服务器')
    } else {
      const status = error.response.status
      if (status === 401 || status === 403) {
        ElMessage.error('权限不足或登录已过期')
      } else if (status >= 500) {
        ElMessage.error('服务器繁忙，请稍后再试')
      }
    }
    return Promise.reject(error)
  }
)

export default service

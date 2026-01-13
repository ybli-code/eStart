import request from '@/utils/request'

export default {
  // 登录
  login(params: any) {
    return request.post('/index/login', params)
  },
  // 注册
  register(params: any) {
    return request.post('/index/register', params)
  },
  // 保存配置
  configInfoSave(params: any) {
    return request.post('/configInfo/saveOrUpdate', params)
  },
  // 获取配置
  configInfoCurInfo(params: any) {
    return request.get('/configInfo/curInfo', { params })
  },
  // 获取根据用户ip获取位置信息
  getCityLocal() {
    return request.get('/api/getLocation')
  },
  // 获取实况天气
  getWeather(cid: string) {
    return request.get('/api/weather', { params: { cid } }).then((res: any) => {
      return res.data ? res.data.HeWeather6[0] : {}
    })
  },
  // 获取一言
  getYiyan() {
    return request.get('/api/yiyan')
  },
  // 获取必应壁纸
  getBingWallpaper() {
    return request.get('/api/bing')
  },
  // 获取必应壁纸列表
  getBingWallpaperList() {
    return request.get('/api/bing/list')
  },
  // 获取随机壁纸
  getBingRandomWallpaper() {
    return request.get('/api/bing/random')
  },
  // 百度搜索建议
  baiduSugrec(params: string) {
    return request.get(`/api/baidu_sugrec/${params}`)
  }
}

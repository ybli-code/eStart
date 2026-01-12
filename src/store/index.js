/*
 * @Author: web.王晓冬
 * @Date: 2020-10-13 09:48:05
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2021-06-22 14:52:17
 * @Description: file content
 */
import Vue from 'vue';
import Vuex from 'vuex';
import local from '@/utils/localStrong';
import dayjs from 'dayjs'
import api from '@/api'
import {
  Message
} from 'element-ui'

import {
  navList,
  imgList
} from "@/json";
import utils from '../utils/utils';

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
Vue.use(Vuex);
// 保存
let saveConfig = (msg) => {
  let userInfo = local.get('userInfo')
  if (!userInfo) return
  
  // 从本地获取或从当前内存状态获取
  let setContentLocal = local.get('setContent') || {}
  let params = Object.assign({}, setContentLocal)
  
  params.note = localStorage.getItem('note') || '[]'
  params.id = localStorage.getItem('configId')
  params.navlist = localStorage.getItem('navList') || '[]'
  params.todo = localStorage.getItem('todo') || '[]'
  params.wallpaper = localStorage.getItem('wallpaper') || ''
  
  api.configInfoSave(params).then(res => {
    if (!msg) return
    Message({
      type: 'success',
      message: "手动备份成功",
      showClose: true
    })
  })
}


let debounceSaveConfig = (msg) => {

  let timer = true
  if (timer) {
    timer = false;
    saveConfig(msg)
    timer = setTimeout(() => {
      timer = true;
    }, 3000);
  } else {
    clearTimeout(timer)
  }
}

const setContent = {
  // 壁纸
  bgBlur: 0, //背景进行模糊处理
  themeMode: 'light', //主题模式
  sunrise: false, //主题样式跟随日出日落
  // 常规设置
  iconSize: 80, //图标大小
  iconRadius: 50, //图标半径
  iconOpacity: 50, //图标透明度
  iconTitle: true, //图标标题
  startAnimation: true, //启动动画
  layout: [3, 5], //图标布局
  yiyan: true, //是否显示一言
  showWeather: true, //是否显示左上角天气
  search: 'baidu', //默认搜索
  timeSize: 50, //时间字体大小
  timeBold: false, //时间是否加粗
}
export default new Vuex.Store({
  state: {
    // 需要存储local
    setContent: setContent, //设置内容
    wallpaper: null, //壁纸
    bingWallpaper: {}, //壁纸
    navList: [], //导航图标列表
    // 无需存储local
    hideAppGroup: false, //是否隐藏应用列表
    editType: '', //编辑类型  add edit
    moment: '', //天气时刻  d白天 n晚上 
    note: [],

    weather: {
      now: {},
      air_now_city: {},
      sun: {}
    }, //实时天气
    isShowSide: false, //是否显示侧边栏
    sideComp: '', //侧边栏组件
    navRowData: {}, //当前操作行数据

    loginInfo: {
      visible: false, //是否显示dialog
      type: '', //是否显示dialog
    },
    userInfo: null,
  },
  getters: {


  },
  mutations: {
    setSetContent(state, val) {
      state.setContent = val || setContent
      local.set("setContent", state.setContent);
      debounceSaveConfig()
    },
    setWallpaper(state, val) {
      state.wallpaper = val
      local.set("wallpaper", val);
      debounceSaveConfig()
    },
    setBingWallpaper(state, val) {
      state.bingWallpaper = val
      local.set("bingWallpaper", val);
    },
    setNavList(state, val) {
      state.navList = val
      local.set("navList", val);
      debounceSaveConfig()
    },
    setMoment(state, val) {
      state.moment = val
      local.set("moment", val);
    },
    setNote(state, val) {
      state.note = val
      local.set("note", val);
      debounceSaveConfig()
    },
    setWeather(state, val) {
      state.weather = val
    },
    setShowSide(state, obj) {
      state.isShowSide = obj.val
      if (obj.comp) {
        state.sideComp = obj.comp
      }
      if (obj.editType) {
        state.editType = obj.editType
      }
    },
    setNavRowData(state, val) {
      state.navRowData = val
    },
    setHideAppGroup(state, val) {
      state.hideAppGroup = val
    },
    setLoginInfo(state, val) {
      state.loginInfo = val
    },
    setUserInfo(state, val) {
      local.set("userInfo", val);
      state.userInfo = val
    },


  },
  actions: {
    // 保存配置
    async saveConfig() {
      debounceSaveConfig(true)
    },
    // 初始化
    async initSetting(context) {
      // 获取必应壁纸
      api.getBingWallpaper().then(res => {
        if (res.code === 200) {
          context.commit('setBingWallpaper', res.data)
        }
      })

      // if (IsPC()) {
      //   setContent.iconSize = 70
      //   setContent.layout = [2, 5]
      // }
      let userInfo = local.get('userInfo')
      const state = context.state
      state.wallpaper = local.get('wallpaper') || null
      state.userInfo = userInfo || {}
      // state.setContent = local.get('setContent') || setContent
      // 合并本地存储和默认配置
      state.setContent = Object.assign({}, setContent, local.get('setContent'))
      state.navList = local.get('navList') || utils.deepClone(navList)
      state.bingWallpaper = local.get('bingWallpaper')
      state.note = local.get('note') || [{
        text: "",
        created: dayjs().valueOf(),
      },]

      // 如果token过期 或者没有登陆 不走接口
      if (!userInfo) return
      let res = await api.configInfoCurInfo()
      let data = res.data || {}
      if (res.code == 200) {

        // 如果id==0此账号没有被保存过
        if (data.id == 0) {
          // 走保存接口
          // 使用当前 state 中的数据，确保新用户能继承默认设置
          let params = Object.assign({}, state.setContent)
          params.note = JSON.stringify(state.note)
          params.navlist = JSON.stringify(state.navList)
          params.todo = localStorage.getItem('todo') || '[]'
          // 如果没有壁纸，使用默认壁纸
          params.wallpaper = localStorage.getItem('wallpaper') || JSON.stringify(imgList[0])
          
          let resSave = await api.configInfoSave(params)
          if (resSave.code == 200) {
            // 保存成功后可能需要获取新的 configId
            let resNew = await api.configInfoCurInfo()
            if (resNew.code == 200 && resNew.data.id != 0) {
              local.set('configId', resNew.data.id)
            }
          }
        } else {
          //保存configID 用于更新配置
          local.set('configId', data.id)
          state.setContent = data || setContent
          state.navList = data.navlist ? JSON.parse(data.navlist) : utils.deepClone(navList)
          
          // 确保解析出来的 wallpaper 是有效的
          let wallpaper = {}
          try {
            wallpaper = data.wallpaper ? JSON.parse(data.wallpaper) : {}
          } catch (e) {
            wallpaper = {}
          }
          state.wallpaper = (wallpaper && wallpaper.src) ? wallpaper : null
          
          state.todo = data.todo ? JSON.parse(data.todo) : {}
          state.note = data.note ? JSON.parse(data.note) : [{
            text: "",
            created: dayjs().valueOf(),
          },]

        }
      }

      Object.keys(setContent).forEach(key => {
        if (state.setContent[key] == undefined) {
          // 如果local里没有 当前项  那么设置成默认
          Vue.set(state.setContent, key, setContent[key])
        }
      })
    }
  },
})
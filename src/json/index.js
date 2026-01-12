/*
 * @Author: web.王晓冬
 * @Date: 2020-10-14 19:37:19
 * @LastEditors: itab.link
 * @LastEditTime: 2022-01-12 20:52:45
 * @Description: file content
 */
const videoList = [
  {
    title: "格里姆瑟尔山口湖中倒映出的星星",
    local: "欧洲 瑞士 伯尔尼",
    src: "https://az3.sfo2.cdn.digitaloceanspaces.com/bingdesktop/3455b6778764415593fb5e688218fb89.mp4",
  },
]
const imgList = [{
  title: "默认",
  local: "中国",
  src: "https://cn.bing.com/th?id=OHR.LlamaDay_ZH-CN2646855786_1920x1080.jpg",
}, 
]


// 0应用 1内置链接 2自定义链接
const navList = [
{
  type: 1,
  url: "",
  title: "待办事项",
  key: "todo",
  iconName: "ri-checkbox-circle-fill",
  bgColor: "#409eff",
  color: "#fff"
},
{
  type: 1,
  url: "",
  title: "便笺",
  key: "note",
  iconName: "ri-sticky-note-fill",
  bgColor: "#fa8511",
  color: "#fff"
},
{
  type: 1,
  url: "",
  title: "设置",
  key: "setting",
  iconName: "ri-settings-3-fill",
  bgColor: "#546e7a",
  color: "#fff"
},
// { type: 1, url: "", title: "快递查询", key: "kuaidi", color: "#e74c3c" },
{
  type: 0,
  url: "https://www.tmall.com",
  title: "天猫",
  key: "tmall",
  bgColor: "#ff0030",
  color: "#fff",
},
{
  type: 0,
  url: "https://www.jd.com",
  title: "京东商城",
  key: "jd",
  bgColor: "#d71912",
  color: "#fff",
},
{
  type: 0,
  url: "https://music.163.com/",
  title: "网易云音乐",
  key: "music163",
  bgColor: "#f24452",
  color: "#fff",
},
{
  type: 0,
  url: "https://www.bilibili.com/",
  title: "bilibili",
  key: "bilibili",
  bgColor: "#fb7299",
  color: "#fff",
},
{
  type: 0,
  url: "http://iqiyi.com/",
  title: "爱奇艺",
  key: "iqiyi",
  bgColor: "#00cc4c",
  color: "#fff",
},
{
  type: 0,
  url: "http://v.qq.com/",
  title: "腾讯视频",
  key: "vqq",
  bgColor: "#ff8200",
  color: "#fff",
},
{
  type: 0,
  url: "https://weibo.com/",
  title: "微博",
  key: "weibo",
  iconName: "ri-weibo-fill",
  bgColor: "#e6162d",
  color: "#fff",
},
{
  type: 0,
  url: "https://www.zhihu.com/",
  title: "知乎",
  key: "zhihu",
  iconName: "ri-zhihu-fill",
  bgColor: "#0084ff",
  color: "#fff",
},
{
  type: 0,
  url: "https://www.ctrip.com/",
  title: "携程",
  key: "ctrip",
  bgColor: "#2377e2",
  color: "#fff",
},
{
  type: 0,
  url: "https://douban.com/",
  title: "豆瓣",
  key: "douban",
  iconName: "ri-douban-fill",
  bgColor: "#00b51d",
  color: "#fff",
},
{
  type: 0,
  url: "https://mail.qq.com/",
  title: "QQ邮箱",
  key: "email",
  iconName: "ri-mail-fill",
  bgColor: "#21a0ff",
  color: "#fff",
},

{
  type: 1,
  url: '',
  title: "添加",
  key: "add",
  iconName: "ri-add-circle-fill",
  bgColor: "#00c853",
  color: "#fff",
}
].map((item, index) => {
  item.id = index
  return item
})
export {
  videoList,
  imgList,

  navList
}
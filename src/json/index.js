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
const navList = [{
  type: 1,
  url: "",
  title: "天气",
  key: "weather",
  color: "#ffc303"
},
{
  type: 1,
  url: "",
  title: "待办事项",
  key: "todo",
  color: "#409eff"
},
{
  type: 1,
  url: "",
  title: "便笺",
  key: "note",
  color: "#fa8511"
},
{
  type: 1,
  url: "",
  title: "设置",
  key: "setting",
  color: "#408ef0"
},
// { type: 1, url: "", title: "快递查询", key: "kuaidi", color: "#e74c3c" },
{
  type: 0,
  url: "https://www.tmall.com",
  title: "天猫",
  key: "tmall",
  color: "#ff0030",
},
{
  type: 0,
  url: "https://www.jd.com",
  title: "京东商城",
  key: "jd",
  color: "#d71912",
},
{
  type: 0,
  url: "https://music.163.com/",
  title: "网易云音乐",
  key: "music163",
  color: "#f24452",
},
{
  type: 0,
  url: "https://www.bilibili.com/",
  title: "bilibili",
  key: "bilibili",
  color: "#00b1ff",
},
{
  type: 0,
  url: "http://iqiyi.com/",
  title: "爱奇艺",
  key: "iqiyi",
  color: "#08db02",
},
{
  type: 0,
  url: "http://v.qq.com/",
  title: "腾讯视频",
  key: "vqq",
  color: "#ff8903",
},
{
  type: 0,
  url: "https://weibo.com/",
  title: "微博",
  key: "weibo",
  color: "#e6162d",
},
{
  type: 0,
  url: "https://www.zhihu.com/",
  title: "知乎",
  key: "zhihu",
  color: "#0084ff",
},
{
  type: 0,
  url: "https://www.ctrip.com/",
  title: "携程",
  key: "ctrip",
  color: "#2377e2",
},
{
  type: 0,
  url: "https://mail.qq.com/",
  title: "豆瓣",
  key: "douban",
  color: "#00b51d",
},
{
  type: 0,
  url: "https://mail.qq.com/",
  title: "QQ邮箱",
  key: "email",
  color: "#f57f4f",
},

{
  type: 1,
  url: '',
  title: "添加",
  key: "add",
  color: "#fa8511",
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
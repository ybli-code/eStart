/*
 * @Author: web.王晓冬
 * @Date: 2020-10-14 16:38:27
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2021-05-31 11:12:13
 * @Description: 时间
*/
<template>
  <div class="app-date-box ac">
    <div @click="toggleAppGroup" class="pointer time-container d-flex-column">
      <div class="time-wrapper d-flex-center">
        <span class="time-unit" :style="timeStyle">{{ timeHour }}</span>
        <span class="time-separator" :style="timeStyle">:</span>
        <span class="time-unit" :style="timeStyle">{{ timeMinute }}</span>
      </div>
      <p class="app-date" :style="dateStyle">{{ date }} 星期{{ week }}</p>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "",
  props: {},
  components: {},
  data() {
    //这里存放数据
    return {
      timeHour: "",
      timeMinute: "",
      date: "",
      week: "",
      timer: null, //定时器
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // 初始化获取天气
    this.getTimeing();
  },
  computed: {
    setContent() {
      return this.$store.state.setContent || {};
    },
    timeStyle() {
      return {
        fontSize: (this.setContent.timeSize || 50) + "px",
        fontWeight: this.setContent.timeBold ? "bold" : "normal",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    },
    dateStyle() {
      return {
        fontSize: Math.max(12, (this.setContent.timeSize || 50) * 0.24) + "px",
        fontWeight: this.setContent.timeBold ? "bold" : "normal",
        marginTop: Math.max(4, (this.setContent.timeSize || 50) * 0.1) + "px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    },
  },
  watch: {},
  //方法集合
  methods: {
    toggleAppGroup() {
      this.$store.commit("setHideAppGroup", !this.$store.state.hideAppGroup);
    },
    // 定时获取时间
    getTimeing() {
      // 即时获取时间
      this.getTime();
      this.moment();
      this.timer = setInterval(() => {
        this.moment();
        this.getTime();
      }, 30000);
    },
    // 即时获取时间
    getTime() {
      let week = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日",
      };
      this.date = dayjs().format("MM月DD日");
      this.timeHour = dayjs().format("HH");
      this.timeMinute = dayjs().format("mm");
      this.week = week[dayjs().day()];
    },
    // 判断白天晚上
    moment() {
      let nowDate = dayjs().format("YYYY-MM-DD");

      let rise = new Date(
        `${nowDate} ${this.$store.state.weather.sun.rise}`
      ).getTime(); //日出
      let set = new Date(
        `${nowDate} ${this.$store.state.weather.sun.set}`
      ).getTime(); //日落

      let nowTamp = dayjs().valueOf();
      let moment = nowTamp > rise && nowTamp < set ? "d" : "n";

      // 如果当前时间大于日出时间 并且小于日落时间 那就是白天
      this.$store.commit("setMoment", moment);
    },
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroyed() {
    this.timer = null;
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
.app-date-box {
  color: #fff;
  margin-bottom: 20px;
}
.time-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
}
.time-wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.1em; /* 使用 em 单位随字体大小自动调整间距 */
  min-width: 2em;
}
.time-unit {
  display: inline-block;
  min-width: 1.2em; /* 确保时/分有最小显示间距，防止跳动 */
  text-align: center;
}
.time-separator {
  display: inline-block;
  margin: 0 0.05em;
}
.app-date {
  opacity: 0.8;
  white-space: nowrap;
}
</style>

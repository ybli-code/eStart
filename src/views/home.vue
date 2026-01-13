<template>
  <div class="app-container">
    <div class="app-content">
      <!-- 顶部内容 -->
      <Header />

      <!-- <d-iocn class="app-logo iconfont icon-ling"></d-iocn> -->
      <!-- 时间 -->
      <dateTime />
      <!-- 搜索框功能 -->
      <searchBox />
      <!-- 应用列表 -->
      <transition name="app-group-fade">
        <appGroupNav class="d-cell" v-show="!hideAppGroup" />
      </transition>

      <!-- FM -->
      <!-- <fm /> -->
      <div class="yiyan-container d-cell">
        <yiyan v-if="yiyan" />
      </div>
    </div>
    <!-- 便笺贴 -->
    <pinned />
    <!-- 侧边栏 -->
    <sideBar />
    <!-- <music /> -->
    <login />
  </div>
</template>

<script>
import login from "@/components/login";
import Header from "@/components/header";
import dateTime from "@/components/date-time";
import searchBox from "@/components/search-box";
import appGroupNav from "@/components/app-group-nav";
import pinned from "@/components/pinned";
import music from "@/components/music.vue";
const yiyan = () => import("@/components/yiyan");
const fm = () => import("@/components/fm");
const sideBar = () => import("@/components/sidebar");

export default {
  name: "",
  props: {},
  components: {
    Header,
    dateTime,
    searchBox,
    appGroupNav,
    yiyan,
    fm,
    sideBar,
    pinned,
    login,
    music,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    yiyan() {
      return this.$store.state.setContent.yiyan;
    },
    hideAppGroup() {
      return this.$store.state.hideAppGroup;
    },
  },
  watch: {},
  methods: {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
};
</script>
<style lang='less' scoped>
.app-container {
  // position: absolute;
  height: 100%;
  width: 100%;
}
.app-content {
  height: 100%;
  display: flex;
  flex-flow: column;
}
.app-container {
  // position: absolute;
  height: 100%;
  width: 100%;
}
.app-logo {
  height: 80px;
  width: 180px;
  color: #fff;
  display: inline-block;
}

/* 应用列表显隐动画 */
.app-group-fade-enter-active,
.app-group-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center top;
}

.app-group-fade-enter,
.app-group-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

/* 固定一言位置 */
.yiyan-container {
  margin-top: auto; /* 推到最底部 */
  padding-bottom: 20px;
  min-height: 60px; /* 保持固定高度，防止显隐时抖动 */
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
</style>

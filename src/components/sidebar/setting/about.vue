<template>
  <div>
    <section class="set-section mt20">
      <h2>关于</h2>
      <ul class="set-about">
        <li>当前版本: v{{ version }}</li>
        <li>
          <a href="/" target="_blank"> 隐私政策 </a>
        </li>
        <li>
          <a href="/" target="_blank"> 联系我 </a>
        </li>
        <li @click="opentModal('反馈与建议')">反馈与建议</li>
        <li @click="opentModal('捐助我')">捐助我</li>
      </ul>
    </section>
    <el-dialog width="520px" :visible.sync="visible" :title="title">
      <div class="ac f14" v-show="title == '反馈与建议'">
        <p class="mb20">
          如需反馈问题、提供建议，请加作者微信：xdlumia,进入微信群
        </p>
        <img src="@/assets/xdlumia-min.jpg" alt="" />
      </div>
      <div class="give-reward" v-show="title == '捐助我'">
        <p class="mb10 ac f14" v-lh="20">
          如果觉得还不错，请随意打赏，您的支持将鼓励我做的更好。
          <br />请简单粗暴的爱我，爱你们，么么哒(╯ε╰)
        </p>
        <img src="@/assets/alipay-min.jpg" alt="" />
        <img src="@/assets/wechat-min.jpg" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      visible: false,
      title: "捐助我",
    };
  },
  computed: {},
  watch: {},
  methods: {
    opentModal(title) {
      this.title = title;
      this.visible = true;
    },
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style lang='less' scoped>
.set-about {
  li,
  a {
    cursor: pointer;
    color: var(--primary-color);
  }
}
.give-reward {
  img {
    max-width: 50%;
  }
}
.main {
  line-height: 24px;
  strong {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
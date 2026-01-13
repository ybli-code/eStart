<template>
  <div class="app-yiyan ac">
    <div
      class="yiyan-text f12"
      v-clipboard:copy="yiyan.hitokoto"
      @contextmenu="yiyanHandle"
      v-clipboard:success="onCopy"
      title="点击左键复制，右键切换"
    >
      「 {{ yiyan.hitokoto }} 」
    </div>
    <div class="yiyan-from f12">--{{ yiyan.from }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      yiyan: {},
    };
  },
  created() {
    this.getYiyan();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    yiyanHandle() {
      this.getYiyan();
    },
    getYiyan() {
      this.$http.getYiyan().then((res) => {
        this.yiyan = res || {};
      });
    },
    onCopy() {
      this.$message.success("一言已复制到剪切板");
    },
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroyed() {},
};
</script>
<style lang='less' scoped>
//@import url();
.app-yiyan {
  overflow: hidden;
  cursor: pointer;
  max-height: 60px;
  padding: 10px 0;
  transition: 0.3s;
  line-height: 20px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.9);
  .yiyan-text {
    text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  }
  .yiyan-from {
    opacity: 0;
    transition: 0.4s;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    backdrop-filter: blur(1px);
    .yiyan-from {
      opacity: 1;
    }
  }
}
</style>

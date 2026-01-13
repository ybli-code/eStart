<template>
  <div class="app-fm al">
    <ul class="fm-box d-flex">
      <li class="d-cell">
        <div class="fm-title">
          <span>
            This Time - Carrie Underwood-张杰
            <p class="fm-time fr">{{ currentTime }}/{{ duration }}</p></span
          >
        </div>
        <div class="fm-progress">
          <p class="fm-progress-curr" v-w="`${progress}%`"></p>
        </div>
      </li>
      <li class="f24 ml20">
        <i
          :class="`el-icon-video-${isPlay ? 'pause' : 'play'}`"
          @click="playPause"
        ></i>
      </li>
    </ul>
    <audio
      class="d-hide"
      id="audio"
      @timeupdate="audioUpdateTime"
      @playing="playing"
      controls
      autoplay
      src="https://m8.music.126.net/20201027224122/5947f4e7d7370d53a08d039a31eeb82e/ymusic/0652/0f53/5653/181ac6b261898ffaa1c4a91d81eb1eb1.mp3"
    >
      您的浏览器不支持 audio 标签。
    </audio>
  </div>
</template>

<script>
import axios from "axios";
let audio = "";
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      duration: "00:00",
      currentTime: "00:00",
      progress: 0,
      isPlay: false,
    };
  },
  created() {
  },
  mounted() {
    audio = document.getElementById("audio");
    this.getDoubanFm();
  },
  computed: {},
  watch: {},
  methods: {
    getDoubanFm() {
      this.$http.getDoubanFm().then((res) => {
        if (res.code != 200) {
          return;
        }
        let data = JSON.parse(res.data || "{}");
        console.log(data.song.length);
      });
    },
    playing() {
      this.isPlay = true;
    },
    playPause() {
      if (this.isPlay) {
        audio.pause();
      } else {
        audio.play();
      }
      this.isPlay = !this.isPlay;
    },
    timeToString(time) {
      time = parseInt(time);
      let Intmm = parseInt(time / 60);
      let mm = Intmm < 10 ? "0" + Intmm : Intmm;
      let yu = time % 60;
      let ss = yu < 10 ? "0" + yu : yu;
      return `${mm}:${ss}`;
    },
    audioUpdateTime(res) {
      let duration = res.target.duration;
      let currentTime = res.target.currentTime;
      this.progress = (currentTime / duration) * 100;
      this.duration = this.timeToString(duration);
      this.currentTime = this.timeToString(currentTime);
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
.app-fm {
  width: 100%;
  font-size: 12px;
  padding: 10px 20px;
  overflow: hidden;
  color: #fff;
  cursor: pointer;

  .fm-box {
    opacity: 0.8;
    max-width: 400px;
    margin: 0 auto;
    .fm-progress {
      width: 100%;
      margin: 10px 0;
      width: 100%;
      height: 1px;
      background-color: #999;
      .fm-progress-curr {
        background-color: #fff;
        height: 100%;
        width: 0%;
      }
    }
    .fm-time {
      color: #e1e1e1;
    }
  }
}
</style>

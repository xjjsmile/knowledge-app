<template>
  <div v-if="device == 'ANDROID' || device == 'IOS' || device == 'WX'">
    <div id="downloadApp" >
      <div class="articleInfo">
        <div class="ratiobox">
          <img src="./../assets/logo.png" width="100%" />
        </div>
        <div class="detail">火把知识</div>
      </div>
      <span class="foucsButton" @click="download">打开</span>
    </div>
    <div style="height:58px;"></div>
  </div>
</template>

<style lang="scss">
#downloadApp {
  background-color: $white;
  padding: 10px;
  box-shadow: 0px 0 12px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 9999;
  max-width: 640px;

  @include displayFlex(flex, space-between, center);
  @include textOverflow;

  .articleInfo {
    @include displayFlex(flex, flex-start, null);
    @include textOverflow;
    flex-grow: 1;

    .detail {
      margin-left: 10px;
      flex-direction: column;
      @include displayFlex(flex, center, flex-start);
      @include textOverflow;
      .number {
        font-size: $fontSize - 2;
        color: $cl9;
      }
    }

    .ratiobox {
      width: 38px;
      height: 0;
      padding-bottom: 38px;
      flex-shrink: 0;
    }
  }

  .foucsButton {
    display: inline-block;
    width: 50px;
    line-height: 20px;
    background-color: $redDark;
    color: $white;
    text-align: center;
    border-radius: 10px;
    font-size: $fontSize - 2;
    flex-shrink: 0;
  }
}
</style>

<script>
export default {
  data() {
    return {
      device: "ANDROID"
    };
  },
  mounted() {
    this.device = this.$route.query.device;
  },
  methods: {
    download() {
      this.$linkToApp();
    }
  }
};
</script>


<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon
      v-if="!isFullScreen"
      icon-class="fullscreen"
      class="fullscreen"
      @click="toggleFullScreen"
    />
    <svg-icon
      v-else
      icon-class="exit-fullscreen"
      class="fullscreen"
      @click="toggleFullScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullScreen: false // 默认不全屏
    }
  },
  methods: {
    toggleFullScreen() {
      // 判断浏览器是否支持全屏
      if (ScreenFull.isEnabled) {
        // 支持
        ScreenFull.toggle()
        this.isFullScreen = !this.isFullScreen
      } else {
        // 不支持
        this.$message.error('您的浏览器版本不支持全屏功能')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  fill: #fff !important;
  cursor: pointer;
}
</style>

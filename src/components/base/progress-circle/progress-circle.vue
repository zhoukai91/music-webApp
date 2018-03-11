<template>
  <div class="progress-circle">
    <svg :height="radius" :width="radius" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-background" />
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-bar"
              :stroke-dasharray="dasharray" :stroke-dashoffset="offset" />
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    radius: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dasharray: Math.PI * 100
    }
  },
  computed: {
    offset () {
      return (1 - this.percent) * this.dasharray
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>

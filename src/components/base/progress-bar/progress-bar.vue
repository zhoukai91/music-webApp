<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
import {mapGetters} from 'vuex'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  date () {
    return {
    }
  },
  created () {
    this.touch = {}
    this.progressBarWidth = 0
  },
  methods: {
    progressClick (e) {
      // 当点击btn时，e.offsetX值不对，存在bug
      this._setOffset(e.offsetX)
      this._triggerPercent()
    },
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (this.touch.initiated) {
        let deltaX = e.touches[0].pageX - this.touch.startX
        // 防止左右移动越界
        let offset = Math.min(this.progressBarWidth, Math.max(deltaX + this.touch.left, 0))
        this._setOffset(offset)
      }
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _setOffset (offset) {
      this.$refs.progress.style.width = offset + 'px'
      this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent (newValue) {
      if (newValue > 0 && !this.touch.initiated) {
        this.progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offset = this.progressBarWidth * newValue
        this._setOffset(offset)
      }
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>

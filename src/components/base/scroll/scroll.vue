<template>
 <div ref="wrapper">
   <slot></slot>
 </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  name: 'scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this._initScroll()
  },
  methods: {
    _initScroll () {
      // 当前better-scroll版本，会根据内容高度的变化自动重新计算 内容的高度
      if (!this.$refs.wrapper) {
        return false
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },
    // 添加代理方法，方便父组件调用this.scroll的方法
    enable () {
      this.scroll.enable && this.scroll.enable()
    },
    disable () {
      this.scroll.disable && this.scroll.disable()
    },
    refresh () {
      this.scroll.refresh && this.scroll.refresh()
    },
    toScrollElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style lang="stylus">

</style>

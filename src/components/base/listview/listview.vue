<template>
  <scroll class="listview"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li  v-for="item in group.items" :key="item.id" class="list-group-item" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :data-index="index"
            class="item"
            :key="index"
            :class="{'current': currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'components/base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'components/base/loading/loading'

const SHORTCUTLIST_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'listview',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      listenScroll: true,
      probeType: 3,
      currentIndex: 0,
      diff: -0
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    },
    fixedTitle () {
      return this.shortcutList[this.currentIndex] ? this.shortcutList[this.currentIndex] : ''
    }
  },
  created () {
    this.startY = 0
    this.startIndex = 0
    this.listHeight = []
  },
  methods: {
    onShortcutTouchStart (e) {
      this.startY = e.touches[0].clientY
      let index = getData(e.target, 'index')
      this.startIndex = parseInt(index)
      // 调用Scroll组件的内部方法
      this.currentIndex = this.startIndex
      this._toScroll(index)
    },
    onShortcutTouchMove (e) {
      let moveListLen = (e.touches[0].clientY - this.startY) / SHORTCUTLIST_HEIGHT | 0
      let toIndex = this.startIndex + moveListLen
      this.currentIndex = toIndex
      this._toScroll(toIndex)
    },
    selectItem (item) {
      this.$emit('selectItem', item)
    },
    scroll (newY) {
      // 当滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
      }
      // 在中部滚动时
      for (let i = 0; i < this.listHeight.length - 1; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          //  出现bug，fixedTitle 清空
          this.diff = height2 + newY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = this.listHeight.length - 2
    },
    _toScroll (index) {
      if (!index && index !== 0) {
        return
      }
      // 阻止touchMove 过界时的操作
      if (index <= 0) {
        this.currentIndex = 0
        return
      } else if (index > this.listHeight.length - 2) {
        this.currentIndex = this.listHeight.length - 2
        return
      }
      this.$refs.listview.toScrollElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      let height = 0
      this.listHeight[0] = height
      let lists = this.$refs.listGroup
      for (let i = 0; i < lists.length; i++) {
        height += lists[i].clientHeight
        this.listHeight[i + 1] = height
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 性能优化，减少dom操作
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

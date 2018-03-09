<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper" >
        <ul>
          <li v-for="(song, index) in songs" :key="index" class="item" @click="selectItem(index)">
            <div class="content">
              <h2 class="name">{{song.name}}</h2>
              <p class="desc">{{getDesc(song)}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'components/base/scroll/scroll'
import loading from 'components/base/loading/loading'
import {prefixSyle} from 'common/js/dom'

const transform = prefixSyle('transform')
const RESERVED_HEIGHT = 40

export default {
  name: 'music-list',
  data () {
    return {
      scrollY
    }
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    bgImg: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  created () {
    this.listenScroll = true
    this.probeType = 3
  },
  mounted () {
    this._setMusicTop()
    window.onresize = () => {
      this._setMusicTop()
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    scroll (newY) {
      let translateY = Math.max(newY, RESERVED_HEIGHT - this.imageHeight)
      let zIndex = 10
      let percent = Math.abs(newY / this.imageHeight)
      let scale = newY > 0 ? 1 + percent : 1
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px, 0)`
      // 但滚动到顶部
      if (newY < translateY) {
        this.$refs.bgImage.style['z-index'] = zIndex
        this.$refs.bgImage.style.height = RESERVED_HEIGHT + 'px'
        this.$refs.bgImage.style.paddingTop = '0'
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.zIndex = '0'
        this.$refs.bgImage.style.height = '0'
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.playBtn.style.display = ''
      }
      if (newY > 0) {
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    getDesc (song) {
      return `${song.singer}·${song.album}`
    },
    selectItem (index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    _setMusicTop () {
      if (this.$refs.list) {
        // 设置list的TOP =  视口宽度 * 0.7
        this.imageHeight = document.body.clientWidth * 0.7
        this.imageHeight = Math.min(this.imageHeight, 600)
        this.$refs.list.$el.style.top = this.imageHeight + 'px'
        this.$refs.bgImage.style.paddingTop = '0'
        this.$refs.bgImage.style.height = this.imageHeight + 'px'
      }
    },
    ...mapActions(['selectPlay'])
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImg})`
      // return `background:url(${this.singer.avatar})`
    },
    ...mapGetters(['singer'])
  },
  components: {
    loading,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      max-hieght: 600px
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      /*height: 100%*/
      // 确保list 全部被暴露在视口内，否侧 无法下拉到底部
      bottom: 0
      width: 100%
      .song-list-wrapper
        padding: 20px 30px
        .item
          display: flex
          align-items: center
          box-sizing: border-box
          height: 64px
          font-size: $font-size-medium
          .content
            flex: 1
            line-height: 20px
            overflow: hidden
            .name
              no-wrap()
              color: $color-text
            .desc
              no-wrap()
              margin-top: 4px
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

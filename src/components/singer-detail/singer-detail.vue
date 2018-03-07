<template>
  <transition name="slide">
    <musicList :title="title" :songs="songs" :bg-img="bgImg"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song.js'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'singer-detail',
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getDetail(this.singer.id)
  },
  methods: {
    _getDetail (singerId) {
      if (!singerId) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(singerId).then((res) => {
        if (ERR_OK === res.code) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs (lists) {
      let ret = []
      lists.forEach((item) => {
        let {musicData} = item
        if (musicData.albummid && musicData.songmid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  computed: {
    bgImg () {
      return this.singer.avatar ? this.singer.avatar.replace(/150x150/, '300x300') : ''
    },
    title () {
      return this.singer.name
    },
    ...mapGetters(['singer'])
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus">
.slide-enter-active, .slide-leave-active
  transition: all 0.4s
.slide-enter, .slide-leave
  transform: translate3d(100%,0,0)
</style>

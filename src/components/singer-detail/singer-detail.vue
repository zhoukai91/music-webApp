<template>
  <div class="singer-detail">
    123
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song.js'

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
          console.log(this.songs)
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
    ...mapGetters(['singer'])
  }
}
</script>

<style lang="stylus">
.singer-detail
  position: fixed
  top: 80px
  bottom: 0
  width: 100%
  z-index: 100
  background-color: #222
</style>

import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        let ret = res
        if (typeof ret === 'string') {
          // var reg = /^\w+\(({[^()]+})\)$/
          var reg = /^\w+\(([^\r]+)\)$/
          var matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
            res = ret || res
          }
        }
        if (res.code === ERR_OK) {
          this.lyric = res.lyric
          resolve(res.lyric)
        } else {
          /* eslint-disable */
          reject('歌词解析出错')
        }
      }).catch((e) => {
        /* eslint-disable */
        reject('没有找到歌词')
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // 有些歌曲链接不可以
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`})
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

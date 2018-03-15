import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// export function getDiscList () {
//   const url = '/api/getDiscList'
//
//   const data = Object.assign({}, commonParams, {
//     loginUin: 0,
//     hostUin: 0,
//     platform: 'yqq',
//     needNewCode: 0,
//     lan: 'all',
//     cmd: 'shoubo',
//     notice: 0,
//     format: 'jsonp',
//     data: {
//       'comm': {'ct': 24},
//       'recomPlaylist': {
//         'method': 'get_hot_recommend',
//         'param': {'async': 1, 'cmd': 2},
//         'module': 'playlist.HotRecommendServer'
//       }
//     }
//   })
//
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     console.log(res)
//     return Promise.resolve(res.data)
//   })
// }

export function getDiscList () {
  // const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    lan: 'all',
    cmd: 'shoubo',
    notice: 0,
    format: 'jsonp',
    data: JSON.stringify({
      'comm': {'ct': 24},
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': {'async': 1, 'cmd': 2},
        'module': 'playlist.HotRecommendServer'
      }
    })
    // jsonpCallback: 'MusicJsonCallback02200965800659871'
  })

  // return jsonp(url, data, options)
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = '/api/getSongList'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    format: 'json',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log(res)
    return Promise.resolve(res.data)
  })
}

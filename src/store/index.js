import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // 开启debug模式，确保state状态的变化，只能由mutation操作更新
  strict: debug
  // 当state状态变化时，将通过console.log打印，当使用vue-devtools插件时，不需要createLogger插件
  // plugins: debug ? [createLogger()] : []
})

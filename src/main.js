import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'
import Toasted from 'vue-toasted'
import 'common/stylus/index.styl'

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(lazyload, {loading: require('common/image/default.png')})
Vue.use(Toasted)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

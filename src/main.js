import Vue from 'vue'
import router from './router'
import Axios from 'axios'
// import VueResource from 'vue-resource'
import App from './App'

import 'common/stylus/index.styl'

/* eslint-disable no-new */

new Vue({
  el: '#app',
  render: h => h(App),
  router
})

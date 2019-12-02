import Vue from 'vue'
import App from './App'

import $ from 'jquery'
// 引入全局组件
import globalComponents from './common/globalComponents'

import router from './router'
import store from './store'

import * as filter from './filters'
import common from './common'

import {
  apiPut,
  apiGet,
  apiPost,
  apiPostJson,
  apiGetBlob
} from '@/fetch/api'

Vue.use(globalComponents);
window.$ = $

Vue.prototype.filter = filter
Vue.prototype.common = common

Vue.prototype.apiGet = apiGet
Vue.prototype.apiPost = apiPost
Vue.prototype.apiPut = apiPut
Vue.prototype.apiGetBlob = apiGetBlob


Vue.config.productionTip = false
/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

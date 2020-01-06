import Vue from 'vue'

// import $ from 'jquery'
// window.$ = $
// UI组件
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import VueClipboard from 'vue-clipboard2'
// 全局自定义组件

function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  Vue.use(iView);
  Vue.use(VueClipboard);
}
Vue.use(plugin)

export default plugin

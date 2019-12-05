// UI组件
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import VueClipboard from 'vue-clipboard2'
import VueCookies from 'vue-cookies'

// 全局自定义组件

function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  Vue.use(iView);
  Vue.use(VueClipboard);
  Vue.use(VueCookies);
}

export default plugin

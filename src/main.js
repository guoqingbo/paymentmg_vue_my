import Vue from 'vue'
import App from './App'
import './validate'
import router from './router'
import store from './store'
import iView from 'iview'

// import axios from 'axios'
import VueCookies from 'vue-cookies'
import 'iview/dist/styles/iview.css'
import * as filter from './filters'
import common from './common'
import Main from './components/main'
import VueClipboard from 'vue-clipboard2'
import {
  apiGet,
  apiPost,
  apiPostJson
} from '@/fetch/api'

// 防止页面刷新路由失效
router.beforeEach(async (to, from, next) => {
    let token = VueCookies.get('token')
    let userId = VueCookies.get('userId')
    if (token) { // 本地获取了token说明用户登录过了
      if (!store.state.userId) { // vuex中没有获取userId,说明是刷新,就需要去动态加载路由
        store.dispatch('setUserIdAction', userId)
        await store.dispatch('getApi') // 获取权限
        store.dispatch('formaterRouterHandle') // 根据权限获取路由
        router.addRoutes([{
          path: '/main',
          name: 'main',
          component: Main,
          children: [...store.state.menu.asyncRouter]
        }])
        next({
          ...to,
          replace: true
        }) // hack写法，保证路由已经添加成功
      } else { // 页面不是刷新，只是路由变化
        if (to.matched.length) { // 有匹配到路由
          next()
        } else {
          next('/404')
          // next()
        }
        // next()
      }
    } else { // 没登录过
      if (to.name === 'login' || to.name === 'adminLogin') {
        next()
      } else {
        next({name: 'login'})
      }
      // next()
    }
})

Vue.use(iView)
Vue.use(VueCookies)
Vue.use(VueClipboard)

Vue.config.productionTip = false
Vue.prototype.filter = filter
Vue.prototype.common = common
Vue.prototype.apiGet = apiGet
Vue.prototype.apiPost = apiPost

// Object.keys(filter).forEach(key => {
//   Vue.filter(key, filter[key])
// })


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

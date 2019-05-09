import Vue from 'vue'
import App from './App'
import './validate'
import router from './router'
import store from './store'
import iView from 'iview'
import $ from 'jquery'

// import axios from 'axios'
import VueCookies from 'vue-cookies'
import 'iview/dist/styles/iview.css'
import * as filter from './filters'
import common from './common'
import Main from './components/main'
import VueClipboard from 'vue-clipboard2'


// if (window.location.href.split('#/')[1] = 'login') {
//   main()
//   window.location.href = window.location.href

// }
// async function main() {
//   let userId = VueCookies.get('userId')
//   store.dispatch('setUserIdAction', userId)
//   await store.dispatch('getApi') // 获取权限

//   store.dispatch('formaterRouterHandle') // 根据权限获取路由
//   router.addRoutes([{
//     path: '/main',
//     name: 'main',
//     component: Main,
//     children: [...store.state.menu.asyncRouter]
//   }])
// }

// 自定义拖拽组件

// 防止页面刷新路由失效
router.beforeEach(async (to, from, next) => {
  if (to.query.source) { //判断是否是小鲸商城跳转过来的
    VueCookies.set('pmsToken',"testToken123456")
    VueCookies.set('userId',"userId24567")
    await store.dispatch('getApi',to.query.userInfoId) // 获取权限
    store.dispatch('formaterRouterHandle') // 根据权限获取路由
    router.addRoutes([{
      path: '/main',
      name: 'main',
      component: Main,
      children: [...store.state.menu.asyncRouter]
    }])
    next(to.path)
  }else{
      // let userToken = sessionStorage.getItem('pmsToken')
  // let userId = sessionStorage.getItem('userId')
  let userToken = VueCookies.get('pmsToken')
  let userId = VueCookies.get('userId')
  // console.log(userToken)
  if (userToken) { // 本地获取了token说明用户登录过了

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
      next({ ...to,
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
    if (to.name === 'login'||to.name === 'adminLogin') {
      next()
    } else {
      next({name: 'login'})
    }
    // next()
  }
  }

})


window.$ = $
Vue.use(iView)
Vue.use(VueCookies)
Vue.use(VueClipboard)

Vue.config.productionTip = false
// Vue.prototype.$http = axios
Vue.prototype.filter = filter
Vue.prototype.common = common

Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})


//混合，全局使用api
Vue.mixin({
  data() {
    return {
      upUrl:'/manage/admin/admin/ui/upload'
    }
  },
  methods: {
  }
})


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

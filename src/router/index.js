import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import store from '../store/index'
import {
  routers
} from './router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // mode: 'hash',
  routes: routers
})

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start()
  store.dispatch('setActiveNameAction', to.meta.belongTab)
  store.dispatch('setOpenNameAction', to.meta.openName)
  store.dispatch('setBreadcrumbListAction', to.meta.breadcrumbList)
  let title = '支付中心'
  if(router.app.common.config.env == 'production'){
    title +='生产'
  }else if(router.app.common.config.env == 'test'){
    title +='测试'
  }else if(router.app.common.config.env == 'pre'){
    title +='预发'
  }else{
    title +='开发'
  }
  if(to.meta.title){
    title+="-"+to.meta.title
  }
  document.title = title
  if(to.meta.isLogin === false){
    return next()
  }
  let token = router.app.$cookies.get('token')
  let userId = router.app.$cookies.get('userId')
  if (token) { // 本地获取了token说明用户登录过了
    if (!store.state.userId) { // vuex中没有获取userId,说明是刷新,就需要去动态加载路由
      store.dispatch('setUserIdAction', userId)
      // 防止页面刷新路由失效
      await store.dispatch('getMenu') // 获取权限
      store.dispatch('formaterRouterHandle') // 根据权限获取路由
      router.addRoutes([{
        path: '/main',
        name: 'main',
        component: resolve => {
          require(['@/components/main.vue'], resolve)
        },
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
    next({name: 'login'})
    // console.log(to.matched.length)
    // if (to.matched.length ===0) {  //如果未匹配到路由
    //   return next('/404');
    // }
    // if (to.name === 'login' || to.name === 'adminLogin') {
    //   next({name: 'login'})
    // } else {
    //   next({name: 'login'})
    // }
    // next()
  }
})
router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router

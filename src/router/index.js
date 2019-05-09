import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import store from '../store/index'
import VueCookies from 'vue-cookies'
import {
  routers
} from './router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
  routes: routers
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // sessionStorage.setItem('activeName', to.meta.belongTab)
  VueCookies.set('activeName', to.meta.belongTab)
  store.dispatch('setActiveNameAction', to.meta.belongTab)
  store.dispatch('setOpenNameAction', to.meta.openName)
  // store.dispatch("updateSubMenuListAction",to.meta.belongTab)
  // Util.title(to.meta.title);
  next()
})

router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router

import {apiGet} from '../../fetch/api'

const state = {
  menuList: '',
  activeName: '',
  openName: '',
  asyncRouter: '',
  breadcrumbList: []
}
const getters = {}

const mutations = {
  updateMenulist(state) {
  },
  setActiveName(state, name) {
    state.activeName = name
  },
  setOpenName(state, name) {
    state.openName = name
  },
  setBreadcrumbList(state, name) {
    state.breadcrumbList = name
  },
  formaterRouter(state) {// 根据权限生成路由
    let roleRouter = []
    // let length = state.menuList.data.length
    if (!(state.menuList && state.menuList.data && state.menuList.data.length)) {
      //   window.location.href = ''
      return
    }
    state.menuList.data.forEach(item => {
      // 根据用户权限生成路由
      let firstRouter = item.funCode
      item.list.forEach(it => {
        let secontName = it.funName
        let secondRouter = it.funCode
        if(!it.list || !it.list.length){
          // 如果是二级菜单
          let meta = {
            breadcrumbList: [secontName],
            belongTab: firstRouter,
            openName: secondRouter
          }
          let path = `/${firstRouter}/${secondRouter}`
          let name = secondRouter
          roleRouter.push({
            path, name, meta,
            component: resolve => {require([`@/components${path}`], resolve)},
          })

        }else if(it.list && it.list.length){
          // 如果三级菜单存在
          it.list.forEach(el => {
            let thirdName = el.funName
            let thirdRouter = el.funCode
            let meta = {
              breadcrumbList: [secontName, thirdName],
              belongTab: firstRouter,
              openName: secondRouter
            }
            let path = `/${firstRouter}/${secondRouter}/${thirdRouter}`
            let name = thirdRouter
            roleRouter.push({
              path, name, meta,
              component: resolve => {require([`@/components${path}`], resolve)},
            })
          })
        }
      })
    })
    state.asyncRouter = roleRouter
  }
}
const actions = {
  async getMenu(context, userInfoId) {
    // let menuList = await apiGet('/manage/admin/admin/menu/getMenu',userInfoId?{userInfoId:userInfoId}:{})
    let menuList = require('../../data/menu.json')
    context.state.menuList = menuList
  },
  setActiveNameAction({commit}, name) {
    commit('setActiveName', name)
  },
  setOpenNameAction({commit}, name) {
    commit('setOpenName', name)
  },
  setBreadcrumbListAction({commit}, name) {
    commit('setBreadcrumbList', name)
  },
  formaterRouterHandle({commit}) {
    commit('formaterRouter')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

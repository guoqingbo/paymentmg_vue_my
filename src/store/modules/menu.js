import config from '@/config'
import common from '@/common'
const state = {
  menuList: '',
  activeName: '',
  openName: '',
  asyncRouter: '',
  breadcrumbList: []
}
const getters = {}

const mutations = {
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
    // let {menuTree} = common.menuToTree(state.menuList)
    // menuTree.forEach(item=>{
    //   // 根据用户权限生成路由
    //   let firstRouter = item.code
    //   item.menus.forEach(it => {
    //     let secontName = it.name
    //     let secondRouter = it.code
    //     if(!it.menus || !it.menus.length){
    //       // 如果是二级菜单
    //       let meta = {
    //         breadcrumbList: [secontName],
    //         belongTab: firstRouter,
    //         openName: secondRouter
    //       }
    //       let path = `/${firstRouter}/${secondRouter}`
    //       let name = secondRouter
    //       roleRouter.push({
    //         path, name, meta,
    //         component: resolve => {require([`@/views${path}`], resolve)},
    //       })
    //
    //     }else if(it.menus && it.menus.length){
    //       // 如果三级菜单存在
    //       it.menus.forEach(el => {
    //         let thirdName = el.name
    //         let thirdRouter = el.code
    //         let meta = {
    //           breadcrumbList: [secontName, thirdName],
    //           belongTab: firstRouter,
    //           openName: secondRouter
    //         }
    //         let path = `/${firstRouter}/${secondRouter}/${thirdRouter}`
    //         let name = thirdRouter
    //         roleRouter.push({
    //           path, name, meta,
    //           component: resolve => {require([`@/views${path}`], resolve)},
    //         })
    //       })
    //     }
    //   })
    // })
    state.menuList.data.forEach(item => {
      // 根据用户权限生成路由
      let firstRouter = item.code
      item.menus.forEach(it => {
        let secontName = it.name
        let secondRouter = it.code
        if(!it.menus || !it.menus.length){
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
            component: resolve => {require([`@/views${path}`], resolve)},
          })

        }else if(it.menus && it.menus.length){
          // 如果三级菜单存在
          it.menus.forEach(el => {
            let thirdName = el.name
            let thirdRouter = el.code
            let meta = {
              breadcrumbList: [secontName, thirdName],
              belongTab: firstRouter,
              openName: secondRouter
            }
            let path = `/${firstRouter}/${secondRouter}/${thirdRouter}`
            let name = thirdRouter
            roleRouter.push({
              path:path, name, meta,
              component: resolve => {require([`@/views${path}`], resolve)},
            })
          })
        }
      })
    })
    state.asyncRouter = roleRouter
  }
}
const actions = {
  async getMenu(context) {
    if(!context.state.menuList){
      // let menuList = await apiGet('/manage/admin/admin/menu/getMenu',userInfoId?{userInfoId:userInfoId}:{})
      let menuList = {}
      let commonMenu = require('../../data/commonMenu.json')
      if(config.env == 'dev'){
        // 本地开发时，加载本地模板菜单，方便开发
        let devMenu = require('../../data/devMenu.json')
        menuList.data = [...commonMenu.data,...devMenu.data]
      }else{
        menuList = commonMenu
      }
      context.state.menuList = menuList
    }
   return context.state.menuList
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
  async formaterRouterHandle(context) {
    await actions.getMenu(context)
    context.commit('formaterRouter')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

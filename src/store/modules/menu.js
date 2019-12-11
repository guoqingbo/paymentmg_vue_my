import config from '@/config'
const state = {
  menuList: '',
  activeName: '',
  openName: '',
  asyncRouter: '',
  breadcrumbList: [],
  authList:[]
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
    if (!(state.menuList && state.menuList.length)) {
      //   window.location.href = ''
      return
    }
    state.menuList.forEach(item => {
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
  },
  mainChildren(state){
    // 格式化数据
    function formateMenuTree(list,node=[]){
      // node为对应父级的节点，node[0] 一级 node[1] 二级 node[2] 三级 等等。。。
      let nowNode = []
      if(list.length){
        list.forEach(ele=>{
          authList.push(ele.privilegeMark)
          let url = ele.privilegeUrl
          if(url){
            let urlArr = url.split("/:")
            let path = urlArr[0]
            let params = urlArr[1]? '/'+urlArr[1]:''

            let breadcrumbList = []
            node.forEach((sele,sindex)=>{
              // breadcrumbList.push(sele.privilegeName)
              if(sindex>0){
                breadcrumbList.push(sele.privilegeName)
              }
            })
            // 当前
            breadcrumbList.push(ele.privilegeName)
            let meta = {
              breadcrumbList,
              belongTab: node[0].privilegeMark,
              openName: node[1]?node[1].privilegeMark:ele.privilegeMark
            }
            roleRouter.push({
              path:path+params,
              name:ele.privilegeMark,
              meta,
              component: resolve => {require([`@/views${path}`], resolve)},
            })

          }
          if(ele.items && ele.items.length){
            let newNode = [...node]
            newNode[ele.privilegeLevel-1] = ele
            formateMenuTree(ele.items,newNode)
          }
        })
      }
      return roleRouter
    }
    // 过滤掉所有的按钮
    function filterMenuBtn(list,menuList=[]){
      if(list.length){
        list.forEach(ele=>{
          if(ele.privilegeMenuType!='2'){
            let item = {...ele}
            item.items = []
            if(ele.items && ele.items.length){
              filterMenuBtn(ele.items,item.items)
            }
            menuList.push(item)
          }
        })
      }
      return menuList
    }
    let authList = [] // 所有的权限
    let roleRouter = [] // 所有的动态路由
    let menuTree = JSON.parse(sessionStorage.getItem('privilegeList')||"[]")

    roleRouter = formateMenuTree(menuTree,[])
    state.menuList = filterMenuBtn(menuTree)
    sessionStorage.setItem('authList',JSON.stringify(authList))
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
        menuList = [...commonMenu.data,...devMenu.data]
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

// 自定义模块状态管理器
// czc
// 2017/7/27

const create = {
  state: {
    componentList: []
  },
  getters: {},
  mutations: {
    componentListupData(state, data) {
      state.componentList = data
    },
    insertBefore(state, insertData) {


    },
    insertAfter(state, insertData) {


    },
    dataUp(stata, updata) {

    },
    delCom(state, index) {


    },
    pushComData(state,data){
      state.componentList.push(data)
    }
  },
  actions: {
    setCompomentList(context, data) { // 直接赋值,用于初始化
      context.commit('componentListupData', data)
    },
    berforeSet(context, insertData) { // 插入某个个组件前
      context.commit('insertBefore', insertData)
    },
    afterSet(context, insertData) { // 插入某个个组件后
      context.commit('componentListupData', insertData)
    },
    pushData(context, data) { //组件放在最后
      context.commit('pushComData',data)
    },
    upDataCom(context, updata) { //更新某个组件

    },
    delSet(context, index) { //删除组件

    }
  }
}

export default create

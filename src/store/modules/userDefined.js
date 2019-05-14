const defined = {
  namespaced: true,
  state: {
    list: [],
    userDefine: false,
    vuxDisabled: false,
    errorShow: false,
    index:0,
  },
  getters: {
    editComData:state=>{
      return state.list[state.index].data
    }
  },
  mutations: {
    setErrorShow(state, flag) {
      state.errorShow = flag
    },
    del(state, index) {
      //删除
      state.list.splice(index, 1)
    },
    add(index, item) {
      //新增

    },
    upData(state, item, index) {
      //更新
      console.log(item, index)
    },
    reset(state, arr) {
      //重置
      state.list = arr
    },
    setDefine(state, flag) {
      state.userDefine = flag;
    },
    setDisable(state, flag) {
      state.vuxDisabled = flag;
    },
    listpush(state, item) {
      // state.list.push(item)
      state.list.splice(item.index, 1, item.obj)
    }
  },
  actions: {
    setErrorShow({
      commit
    }, flag) {
      commit("setErrorShow", flag)
    },
    listpush({
      commit
    }, item) {
      commit('listpush', item)
    },
    del({
      commit
    }, index) {
      // console.log(index)
      //删除
      commit('del', index)
    },
    add(index, item) {
      //新增

    },
    upData({
      commit
    }, item, index) {
      //更新
      commit('upData', item, index)
    },
    reset({
      commit
    }, arr) {
      //重置
      commit('reset', arr)
    },
    setIndex({
      commit
    }, index) {

    },
    setDefine({
      commit
    }, flag) {
      // console.log("zzz")
      commit('setDefine', flag)
    },
    setDisable({
      commit
    }, flag) {
      commit('setDisable', flag)
    }
  }
}

export default defined

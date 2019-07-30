const indexdefined = {
  state: {
    borderIndex: null
  },
  getters: {

  },
  mutations: {
    getIndex(state, index) {
      $("#content").scrollTop(100);
      state.borderIndex = index
    }
  },
  actions: {
    setIndex(context, index) {
      context.commit('getIndex', index)
    }
  }
}

export default indexdefined

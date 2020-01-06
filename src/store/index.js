import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import list from './modules/list'
import menu from './modules/menu'


// 全局变量
import global from './modules/global'

// 应用管理
import merchant from './modules/merchant'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    activeName: 'user',
    subMenuList: [],
    userId: ''
  },
  mutations: {
    add (state, n) {
      state.count += n
    },
    reduce (state) {
      state.count--
    },
    // setActiveName (state, name) {
    //   console.log(name)
    //   state.activeName = name
    // },
    setUserId (state, id) {
      state.userId = id
    }
  },
  getters: {
    count (state) {
      state.count += 100
      return state.count
    }
  },
  actions: {
    addAction (context) {
      context.commit('add', 10)
      setTimeout(() => {
        context.commit ('reduce')
      }, 3000)
    },
    reduceAction ({commit}) {
      commit('reduce')
    },
    getGrid (context) {

    },
    setUserIdAction ({commit}, id) {
      commit('setUserId', id)
    }
  },
  modules: {
    global,
    user,
    list,
    menu,
    merchant
  }
})

export default store

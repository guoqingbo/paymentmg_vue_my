import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import list from './modules/list'
import menu from './modules/menu'
import create from './modules/create'
import indexdefined from './modules/indexdefined'
//自定义页面
import defined from './modules/userDefined'

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
    setActiveName (state, name) {
      state.activeName = name
    },
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
    reduceAction ({
      commit
    }) {
      commit('reduce')
    },
    getGrid (context) {

    },
    setUserIdAction ({commit}, id) {
      commit('setUserId', id)
    }
  },
  modules: {
    user,
    list,
    menu,
    create,
    indexdefined,
    defined
  }
})

export default store

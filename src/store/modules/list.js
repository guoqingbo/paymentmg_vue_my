import {apiPost,apiGet} from '../../fetch/api'
const state = {
  url: '',
  params: '',
  res: '',
  actionsParams: ''
}

const mutations = {
  setUrl (state, url) {
    state.url = url
  },
  setParams (state, params) {
    state.params = params
  },
  columnsHandle (state, params) {
    state.actionsParams = params.actions
    // return [
    //   params('Button', {}, '编辑')
    // ]
    // return [
    //   params('Button', {}, '编辑'),
    //   params('Button', {}, '删除')
    // ]
  }
}

const actions = {
  async getList (context) {
    let res = await apiGet(context.state.url, context.state.params)
    // let res = require('../../data/list.json')
    context.state.res = res
    return context.state.res
  },
  async postApi (context) {
    let res = await apiPost(context.state.url, context.state.params)
    // let res = require('../../data/list.json')
    context.state.res = res
    return context.state.res
  }
}

export default {
  state,
  mutations,
  actions
}

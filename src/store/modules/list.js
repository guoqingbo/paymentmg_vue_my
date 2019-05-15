import {apiPost} from '../../fetch/api'
import list from '../../data/list.json'
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
  // getApi (context, params) {
  //   return apiGet(params.url, params.params)
  // },
  async postApi (context) {
    // return apiPost(params.url, params.params)
    // let res = await apiPost(context.state.url, context.state.params)
    let res = list
    context.state.res = res
    return context.state.res
  }
}

export default {
  state,
  mutations,
  actions
}

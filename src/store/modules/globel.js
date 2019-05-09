const state = {
  url: '',
  params: '',
  res: ''
}

const mutations = {
  setUrl (state, url) {
    state.url = url
  }
}

export default {
  state,
  mutations
}

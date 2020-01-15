import {apiGet,apiPost} from '../../fetch/api'
import VueCookies from 'vue-cookies'

const user = {
  state: {
    userName: VueCookies.get('userName')
  },
  getters: {
    getUserName: (state) => (username) => {
      return this.$cookies.get('userName')
    }
  },
  mutations: {
    setUserName: (state,username) => {
      state.userName = username
    }
  },
  actions: {
    getCurrentUser (context, params) {
      return apiGet(params.url, params.params).then((res)=>{
        if(res.status==200){
          VueCookies.set('userName',res.data.accName)
          VueCookies.set('corpCode',res.data.corpCode)
          context.commit('setUserName',res.data.accName)
        }
      })
    },
    login (context, params) {
      return apiPost(params.url, params.params,params.apiPrefix)
    }
  }
}

export default user

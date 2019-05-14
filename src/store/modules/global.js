// import {apiGet,apiPost} from '../../fetch/api'

const globalConfig = {
  state: {
    payProduct: [
      {label:"个人网银",value:"0"},
      {label:"企业网银",value:"1"},
      {label:"扫码支付",value:"2"}
    ]
  },
  getters: {
    getPayProduct: (state) => (username) => {

      // return sessionStorage.getItem('payProduct')
      // return this.$cookies.get('userName')
    }
  },
  mutations: {
    setPayProduct: (state,username) => {
      state.userName = username
    }
  },
  actions: {
    getPayProduct (context, params) {

      // return apiGet(params.url, params.params).then((res)=>{
      //   if(res.status==200){
      //     context.commit('setPayProduct',res.data)
      //   }
      // })
    }
  }
}

export default globalConfig

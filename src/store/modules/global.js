import {apiGet,apiPost} from '../../fetch/api'

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
    async getChannelType(context){
      let channelType = []
      let res = await apiGet("/channel/type/list")
      if(res.status == 200){
        res.data.forEach((ele)=>{
          let channelTypeItem = {
            value:ele.channelType,
            label:ele.channelTypeName
          }
          channelType.push(channelTypeItem)
        })
      }
      context.state.channelType = channelType
      return context.state.channelType
    }
  }
}

export default globalConfig

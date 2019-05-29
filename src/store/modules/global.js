import {apiGet,apiPost} from '../../fetch/api'

const globalConfig = {
  state: {
    channelType: '',
    cityData:'',
    PayProduct:'',
    merchantSource:''
  },
  getters: {
    // getPayProduct: (state) => (username) => {
    //
    //   // return sessionStorage.getItem('payProduct')
    //   // return this.$cookies.get('userName')
    // }
  },
  mutations: {

  },
  actions: {
    // 获取渠道类型
    async getChannelType(context){
      if(!context.state.channelType){
        let channelType = []
        let res = await apiGet("/channel/type/list")
        if(res.status == 200){
          res.data.forEach((ele)=>{
            channelType.push({
              value:ele.channelType,
              label:ele.channelTypeName
            })
          })
        }
        context.state.channelType = channelType
      }
      return context.state.channelType
    },
    // 获取省市区
    async getCityData(context){
      if(!context.state.cityData){
        let res = await apiGet("/area/list")
        context.state.cityData = res
      }
      return context.state.cityData
    },
    // 获取支付产品
    async getPayProduct(context){
      if(!context.state.payProduct){
        let payProduct = []
        let res = await apiGet("/payProduct/list")
        if(res.status == 200){
          res.data.forEach((ele)=>{
            payProduct.push({
              value:ele.id,
              label:ele.payProductName
            })
          })
        }
        context.state.payProduct = payProduct
      }
      return context.state.payProduct
    },
    // 获取商户来源
    async getMerchantSource(context){
      if(!context.state.merchantSource){
        let merchantSource = []
        let res = await apiGet("/merchantRelation/source/list")
        if(res.status == 200){
          Object.keys(res.data).forEach((ele)=>{
            merchantSource.push({
              value:ele,
              label:res.data[ele]
            })
          })
        }
        context.state.merchantSource = merchantSource
      }
      return context.state.merchantSource
    }
  }
}

export default globalConfig

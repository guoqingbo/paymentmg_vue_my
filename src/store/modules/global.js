import {apiGet,apiPost} from '../../fetch/api'

const globalConfig = {
  state: {
    channelType: '',//渠道类型
    cityData:'', //省市区
    payProduct:'',//支付产品
    channel:'',// 渠道
    merchantSource:'',//商户来源
    payStatus:'',//支付状态
    refundStatus:'',// 退款状态
    auditType:'',// 清算类型
    payChannel:'',// 支付渠道
    channelProduct:''// 渠道产品
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
              value:ele.payProductCode,
              label:ele.payProductName
            })
          })
        }
        context.state.payProduct = payProduct
      }
      return context.state.payProduct
    },
    // 获取支付渠道
    async getPayChannel(context){
      if(!context.state.payChannel){
        let payChannel = []
        let res = await apiGet("/riskPayLimit/channel/list")
        if(res.status == 200){
          res.data.forEach((ele)=>{
            payChannel.push({
              value:ele.channelCode,
              label:ele.channelName
            })
          })
        }
        context.state.payChannel = payChannel
      }
      return context.state.payChannel
    },
    // 获取支付渠道
    async getChannelProduct(context){
      if(!context.state.channelProduct){
        let channelProduct = []
        let res = await apiGet("/riskPayLimit/channelProduct/all")
        if(res.status == 200){
          res.data.forEach((ele)=>{
            channelProduct.push({
              value:ele.channelProductCode,
              label:ele.channelProductName
            })
          })
        }
        context.state.channelProduct = channelProduct
      }
      return context.state.channelProduct
    },
    // 获取商户来源或订单来源
    async getMerchantSource(context){
      if(!context.state.merchantSource){
        let merchantSource = []
        // let res = await apiGet("/merchantRelation/source/list")
        let res = await apiGet("/constant/ordersource")

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
    },
    // 获取支付状态
    async getPayStatus(context){
      if(!context.state.payStatus){
        let payStatus = []
        let res = await apiGet("/constant/paystatus")
        if(res.status == 200){
          Object.keys(res.data).forEach((ele)=>{
            payStatus.push({
              value:ele,
              label:res.data[ele]
            })
          })
        }
        context.state.payStatus = payStatus
      }
      return context.state.payStatus
    },
    // 获取支付状态
    async getChannel(context){
      if(!context.state.channel){
        let channel = []
        let res = await apiGet("/channel/list")
        if(res.status == 200){
          res.data.rows.forEach((ele)=>{
            channel.push({
              value:ele.channelCode,
              label:ele.channelName
            })
          })
        }
        context.state.channel = channel
      }
      return context.state.channel
    },
    // 获取退款状态
    async getRefundStatus(context){
      if(!context.state.refundStatus){
        let refundStatus = []
        let res = await apiGet("/constant/refundstatus")
        if(res.status == 200){
          Object.keys(res.data).forEach((ele)=>{
            refundStatus.push({
              value:ele,
              label:res.data[ele]
            })
          })
        }
        context.state.refundStatus = refundStatus
      }
      return context.state.refundStatus
    },
    // 获取清算类型
    async getAuditType(context){
      if(!context.state.auditType){
        let auditType = []
        let res = await apiGet("/constant/audittype")
        if(res.status == 200){
          Object.keys(res.data).forEach((ele)=>{
            auditType.push({
              value:ele,
              label:res.data[ele]
            })
          })
        }
        context.state.auditType = auditType
      }
      return context.state.auditType
    },
  }
}

export default globalConfig

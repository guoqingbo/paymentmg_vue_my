<template>
  <div></div>
</template>

<script>
  export default {
    name: "callWxPay",
    created() {
      this.wxPay()
    },
    methods: {
      wxPay() {
        let apiPrefix = this.common.config.apiPayPrefix
        let {appid,timestamp,noncestr,packagestr,signtype,paysign,redirectUrl,orderSource,redirectUrlError,merchantNo,payNo,payId} = this.$route.query
        let payParams = {
          appId:appid,
          timeStamp:timestamp,
          nonceStr:noncestr,
          package:packagestr,
          signType:signtype,
          paySign:paysign
        }
        function onBridgeReady() {
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', payParams,
            function (res) {
              // alert(JSON.stringify(res))
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                if(orderSource == 101 && redirectUrl){
                  // 订单来源为小鲸
                  // 回掉地址如果有参数
                  let href = ''
                  if(/\?/.test(redirectUrl)){
                    href = redirectUrl+"&orderSource="+orderSource;
                  }else{
                    href = redirectUrl+"?orderSource="+orderSource;
                  }
                  window.location.href = href;
                }else{
                  let href = apiPrefix+'/page/wechat/success?merchantNo='+merchantNo+'&payNo='+payNo+'&payId='+payId
                    window.location.href = href;
                }
              } else {
                if(orderSource == 101 && redirectUrlError){
                  // 订单来源为小鲸
                  // 回掉地址如果有参数
                  let href = ''
                  if(/\?/.test(redirectUrlError)){
                    href = redirectUrlError+"&orderSource="+orderSource;
                  }else{
                    href = redirectUrlError+"?orderSource="+orderSource;
                  }
                  window.location.href = href;
                }else{
                  let href = apiPrefix+'/page/wechat/fail?merchantNo='+merchantNo+'&payNo='+payNo+'&payId='+payId
                  window.location.href = href;
                }
              }
            });
        }
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
      }
    }
  }
</script>

<style scoped>

</style>

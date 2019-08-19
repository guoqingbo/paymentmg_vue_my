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
        let {appid,timestamp,noncestr,packagestr,signtype,paysign,redirectUrl} = this.$route.query
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
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                document.location.href = redirectUrl;
              } else {
                alert("支付成功，跳转失败")
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

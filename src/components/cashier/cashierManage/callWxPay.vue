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
        let {appid,timestamp,noncestr,packagestr,signtype,paysign,redirectUrl,orderSource,redirectUrlError} = this.$route.query
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
                // 回掉地址如果有参数
                let href = ''
                if(/\?/.test(redirectUrl)){
                  href = redirectUrl+"&orderSource="+orderSource;
                }else{
                  href = redirectUrl+"?orderSource="+orderSource;
                }
                window.location.href = href;
                // 跳转错误页面
                // this.$router.push({
                //   path: "/cashier/cashierManage/payError",
                //   query:{
                //     message:res.message
                //   }
                // });
              } else {
                // window.location.href = redirectUrlError+"&orderSource="+orderSource;
                let href = ''
                if(/\?/.test(redirectUrlError)){
                  href = redirectUrlError+"&orderSource="+orderSource;
                }else{
                  href = redirectUrlError+"?orderSource="+orderSource;
                }
                window.location.href = href;
                // 跳转错误页面
                // this.$router.push({
                //   path: "/cashier/cashierManage/payError",
                //   query:{
                //     message:res.message
                //   }
                // });
                // alert("支付成功，跳转失败")
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

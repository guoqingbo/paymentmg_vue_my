<template>
  <div></div>
</template>

<script>
  export default {
    data() {
      return {
        payType: ""
      }
    },
    created() {
      // 判断是微信，支付宝，还是普通浏览器
      this.isWeixinOrAlipay()
      // 调用支付
      this.jsApiPay()
    },
    methods: {
      // 判断是微信，支付宝，还是普通浏览器
      isWeixinOrAlipay() {
        if (/MicroMessenger/.test(window.navigator.userAgent)) {
          this.payType = "wechat";
        } else if (/AlipayClient/.test(window.navigator.userAgent)) {
          this.payType = "ali";
        } else {
          this.payType = "browser";
        }
        return this.payType
      },
      // 发送支付请求
      jsApiPay(){
        let url = '/jsApiPay'
        let params = this.$route.query
        params.payType = this.payType
        let apiPrefix = this.common.config.apiPayPrefix
        this.apiPost(url,params,apiPrefix).then(res=>{
          if(res.success){
            if (this.payType == "wechat") {
              location.href = res.data;
            } else {
              $("body").html(res.data.formBody)
            }
          }else{
            // 跳转错误页面
            this.$router.push({
              path: "/cashier/cashierManage/payError",
              message:res.message
            });
            // location.href = "http://testpaycenter.zhiyoubao.com/api/pay/aggregatePay/fail?message=" + res.message;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

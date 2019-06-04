<template>
  <div class="cashier-box">
    <h3 class="cashier-title">账号充值</h3>
    <Row class="account-info">
      <Col span="16" class="account-info-left">
        <p>收款商户：{{initCrashier.payOrder.merchantName}}</p>
        <p>商户编号：{{initCrashier.payOrder.merchantNo}}</p>
        <p>订单编号：{{initCrashier.payOrder.orderNo}}</p>
      </Col>
      <Col span="8"class="account-info-right">
        <p class="price">
          <span>￥</span>
          <span class="price-value">{{initCrashier.payOrder.orderAmount}}</span>
        </p>
        <P class="order-money-text">
          <span>订单金额</span>
          <!--<Icon type="md-arrow-dropdown" />-->
        </P>
      </Col>
    </Row>
    <Row>
      <Col span="24" class="pay-way-box">
        <h4 class="pay-way-text">请选择支付方式</h4>
        <RadioGroup vertical
                    class="pay-way-list"
                    v-model="payProductCode">
          <Radio v-for="(item,index) in payWays" :key="index"
                 class="pay-way-item"
                 :disabled="item.disabled"
                 :label="item.label"
                 :class="{active:item.label==payProductCode}">
            <div class="pay-way-info">
              <span class="last-pay-way">{{item.firstText}}</span>
              <img :src=item.icon alt>
              <span>{{item.text}}</span>
            </div>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <div class="bottom-btn">
      <Button type="primary">提交付款</Button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        payWays:[
          {
            icon:require('../../../assets/images/choosePayWay/pay-icon1.png'),
            text:'微信支付',
            label:2002,
            disabled:true,
          },
          {
            icon:require('../../../assets/images/choosePayWay/pay-icon2.png'),
            text:'支付宝',
            label:2001,
            disabled:true,
          },
          {
            icon:require('../../../assets/images/choosePayWay/pay-icon3.png'),
            text:'个人网银',
            label:2005,
            disabled:true,
          },
          {
            icon:require('../../../assets/images/choosePayWay/pay-icon4.png'),
            text:'企业网银',
            label:2006,
            disabled:true,
          },
          {
            icon:require('../../../assets/images/choosePayWay/pay-icon5.png'),
            // text:'快捷支付',
            label:2007,
            disabled:true,
          }],
        payProductCode:'',
        initCrashier:{
          payOrder:{}
        },
      }
    },
    mounted () {

    },
    components: {},
    created(){
      // 获取初始化收银台信息
      this.getCashierIniInfo()
      // 获取订单信息
      // this.getOrderInfo()
    },
    methods: {
      // 获取支付渠道
      getCashierIniInfo(){
        let url = '/initcrashier'
        // let params = {
        //   merchantSourceNo,
        //   orderNo,
        //   orderSource
        // }
        let params  = this.$route.query
        let apiPrefix = this.common.apiPayPrefix
        this.apiGet(url,params,apiPrefix).then(res=>{
          if(res.status == 200){
            this.initCrashier = res.data
            // 是否有上次支付方式
            this.latestPayInfo()
            // 可使用的支付产品
            this.availablePayProducts()
          }
        })
      },
      // 获取订单信息
      // getOrderInfo(){
      //
      // }
      // 获取支付图标
      getPayIcon(code){
        let icon = ''
       this.payWays.forEach(ele=>{
         if(ele.label == code){
           icon = ele.icon
         }
       })
        return icon
      },
      latestPayInfo(){
        let latestPayInfo = this.initCrashier.latestPayInfo
        if(latestPayInfo){
          this.payWays.unshift({
            firstText:'上次支付方式',
            icon:this.getPayIcon(latestPayInfo.payProductCode),
            text:latestPayInfo.yeeBankName + ' | 尾号 ' +latestPayInfo.yeeBankCardTail,
            label:latestPayInfo.payProductCode+","+latestPayInfo.channelProductCode,
          })
        }
      },
      availablePayProducts(){
        let availablePayProducts = this.initCrashier.availablePayProducts
        if(availablePayProducts.length){
          let available = {}
          availablePayProducts.forEach(ele=>{
            available[ele.payProductCode] = ele.payProductName
          })
          this.payWays.forEach(ele=>{
            if(available[ele.label]){
              ele.disabled = false
            }
          })
        }
      }
    }
  }
</script>
<style scoped>
  .cashier-box{
    width: 80%;
    margin: 0 auto;
    font-size: 14px;
  }
  .account-info{
    border-bottom: 1px solid #e5e5e5;
    padding:5px 20px 20px;
  }
  .cashier-title{
    text-align: left;
    font-weight: bold;
    padding: 20px;
  }
  .account-info-left{
    text-align: left;
    /*font-size: 12px;*/
  }
  .account-info-right{
    text-align: right;
  }
  .price{
    color: #ff7200;
    font-weight: bold;
  }
  .price-value{
    font-size: 34px;
  }
  .order-money-text{
    color: #028dd2;
  }
  /*支付方式*/
  .pay-way-box{
    text-align: left;
  }
  .pay-way-text{
    padding: 20px;
    font-weight: normal;
  }
  .pay-way-list{
    width: 100%;
  }
  .pay-way-list .pay-way-item{
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    width: 100%;
  }
  .pay-way-item:nth-child(n+2){
    border-top: 1px solid #e5e5e5;
  }
  .pay-way-list .active{
    border: 1px solid #028dd2;
  }
  .pay-way-list .disabled{
    background-color: #e5e5e54f;
    border-radius: 5px;
    /*border: none;*/
  }
  .pay-way-item img{
    vertical-align: middle;
    height: 25px;
    margin-right: 5px;
  }
  .pay-way-info{
    display: inline-block;
    padding-left: 20px;
  }
  .last-pay-way{
    /*padding-right: 10px;*/
  }
  .bottom-btn{
    padding: 20px;
    text-align: left;
  }
</style>

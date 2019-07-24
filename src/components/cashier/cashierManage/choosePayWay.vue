<template>
  <div class="cashier-box">
    <h3 class="cashier-title">确认并支付</h3>
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
                    v-model="payProductCode"
                    @on-change="onChange(payProductCode)">
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
      <Button type="primary" :loading='loading'@click="submit">提交付款</Button>
    </div>
    <!--二维码-->
    <Modal v-model="modal"
           title="二维码"
              width="400">
      <div class="qrcode-box">
        <qrcode :value="qrcodeUrl" :options="{ size: 170}"></qrcode>
      </div>
      <div slot="footer">
        <Button type="success" @click="modal=false">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import qrcode from "@xkeshi/vue-qrcode";
  // import json2xml from 'json2xml';
  import convert from 'xml-js';
  export default {
    components: {qrcode},
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

        qrcodeUrl:'',
        modal:false,
        params:{

        },
        loading:false
      }
    },
    mounted () {

    },
    created(){
      // 获取初始化收银台信息
      this.getCashierIniInfo()
    },
    methods: {
      // 获取收银台初始化信息
      getCashierIniInfo(){
        let url = '/initcrashier'
        let params  = this.$route.query
        let apiPrefix = this.common.config.apiPayPrefix
        if(params.merchantSourceNo && params.orderNo && params.orderSource){
          this.apiGet(url,params,apiPrefix).then(res=>{
            if(res.status == 200){
              this.initCrashier = res.data
              // 是否有上次支付方式
              this.latestPayInfo()
              // 可使用的支付产品
              this.availablePayProducts()
              // 初始化表单参数
              this.setParams()
            }
          })
        }
      },
      // 获取订单信息
      // getOrderInfo(){
      //
      // }
      // 获取支付图标
      getPayWay(code){
        let icon = ''
        let text = ''
       this.payWays.forEach(ele=>{
         if(ele.label == code){
           icon = ele.icon
           text = ele.text
         }
       })
        return {icon,text}
      },
      latestPayInfo(){
        let latestPayInfo = this.initCrashier.latestPayInfo
        if(latestPayInfo){
          let label = latestPayInfo.payProductCode+","+latestPayInfo.channelProductCode
          let {icon,text} = this.getPayWay(latestPayInfo.payProductCode)
          if(latestPayInfo.yeeBankName){
            text += " "+latestPayInfo.yeeBankName
          }
          if(latestPayInfo.yeeBankCardTail){
            text += ' | 尾号 ' +latestPayInfo.yeeBankCardTail
          }
          this.payWays.unshift({
            firstText:'上次支付方式',
            icon,
            text,
            label,
          })

          this.payProductCode = label
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
      },
      // 选择支付产品
      onChange(value){
        this.params.pay_product_code = ''
        this.params.channel_product_code = ''

        let code = value.toString().split(",")
        if(code.length>1){
          // 上次支付方式
          //支付产品代码 及 渠道产品代码
          this.params.pay_product_code = code[0]
          this.params.channel_product_code = code[1]
        }else{
          //支付产品代码
          this.params.pay_product_code = code[0]
        }
      },
      // 初始化表单参数
      setParams(){
        let payOrder = this.initCrashier.payOrder || {}
        let latestPayInfo = this.initCrashier.latestPayInfo || {}
        this.params = {
          out_trade_no:payOrder.orderNo,//订单号
          // order_time:payOrder.orderTime,//下单时间
          // pay_amount:payOrder.payAmount,//实际付款金额
          // order_amount:payOrder.orderAmount,//订单金额
          pay_product_code:latestPayInfo.payProductCode,//支付产品代码
          channel_product_code:latestPayInfo.channelProductCode,//渠道产品代码
          // sign:'',//签名
          // product_name:payOrder.productName,//商品名称
          // product_code:payOrder.productCode,//商品编码
          // product_num:'',//商品数量
          order_source:payOrder.orderSource,//订单来源
          merchant_source_no:payOrder.merchantSourceNo,//来源商户标识
          // user_source_no:payOrder.userSourceNo,//来源用户标识
          // pay_scene_no:payOrder.payScene,//支付场景编号
          // time_expire:'',//交易过期时间
          // audit_type:'',//清算类型 1：T+1清算 2：担保交易
          submit_source:1,//1 收银台 2其他
          // auth_code:'',//支付授权码
          // buyer_id:''//微信用户标识、支付宝用户标识
        }
      },
      // 提交表单
      submit(){
        this.loading = true
        let url = '/unifiedorder'
        let params  = {requestXml:this.json2xml({xml:this.params})}
        let apiPrefix = this.common.config.apiPayPrefix
        this.apiPost(url,params,apiPrefix).then(res=>{
          res = this.xml2json(res)
          this.loading = false
          if(res.xml.result_code && res.xml.result_code._text == 'SUCCESS'){
            // 如果
            if(res.xml.redirect){
              window.location.href = res.xml.code_url._text
              // window.open(res.xml.code_url._text);
              return
            }
            // 二维码弹框
            this.modal = true;
            this.qrcodeUrl = res.xml.code_url._text;
          }else{
            this.$Message.error(res.xml.return_msg?res.xml.return_msg._text:"支付失败");
          }
        })
      },
      // json 转xml
      json2xml(json){
        // let convert = require('xml-js');
        return convert.js2xml(json,{compact: true})

        // let json2xml = require('json2xml');
        // return json2xml(json,{ header: true })
      },
      xml2json(xml){
        // let convert = require('xml-js');
        return convert.xml2js(xml,{compact:true})
      }
    }
  }
</script>
<style scoped>
  .cashier-box{
    width: 65%;
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
  .qrcode-box{
    text-align: center;
  }
</style>

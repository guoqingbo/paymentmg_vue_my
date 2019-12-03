<template>
  <div style="width: 80%;margin: 0 auto">
    <div class="table-title-box">
      <h4 class="table-title">订单信息</h4>
      <div style="float: right;padding-bottom: 10px">
        <!--支付成功时-->
        <Button @click='compensateNotice' type="primary" :disabled="orderInfo.payStatus!=10">补偿通知</Button>
        <Button @click='abnormalRefund ' type="primary" :disabled="orderInfo.payStatus!=10">异常退款</Button>
      </div>
    </div>
    <myTable ref="myTable"
             :tableRows="tableRows"
             :url="tableUrl"
             :params="tableParams"
              @onGetAfter="onGetAfter"></myTable>

    <h4 class="table-title table-title-refund">退款信息</h4>
    <Table border
           size="small"
           :columns="columns"
           :data="refundOrderDetail"></Table>
    <div class="bottom-btn-box">
      <Button @click='back' type="primary">返回</Button>
    </div>
    <modalForm v-model="abnormalRefundForm"
               :formItems="abnormalRefundFormItems"
               @beforeSave='beforeSave'
               @on-success="onSuccess"
               :apiPrefix="apiPrefix"
               :url="abnormalRefundUrl"
               title="异常退款">
    </modalForm>
  </div>
</template>
<script>
  import myTable from "@/components/global/myTable";
  import modalForm from '@/components/global/modalForm'
  export default {
    components: {myTable,modalForm},
    data () {
      return {
        apiPrefix:this.common.config.apiPayPrefix,
        tableRows: [
          {
            cols:[
              {
              title:'订单编号',
              name:'orderNo'
            },{
              title:'下单时间',
              name:'orderTime'
            },{
              title:'支付流水号',
              name:'payNo'
            }],
          },
          {
            cols:[
              {
                title:'支付时间',
                name:'payTime'
              },{
                title:'订单状态',
                name:'payStatus',
                render: ''
              },{
                title:'订单金额（元）',
                name:'orderAmount',
                render: (h, params) => {
                  return h('span', this.common.formatNumber(params.orderAmount))
                }
              }],
          },
          {
            cols:[
              {
                title:'实付金额（元）',
                name:'payAmount',
                render: (h, params) => {
                  return h('span', this.common.formatNumber(params.payAmount))
                }
              },{
                title:'支付产品',
                name:'payProductName'
              },{
                title:'支付渠道',
                name:'channelName'
              }],
          },
          {
            cols:[
              {
                title:'商品编码',
                name:'productCode'
              },{
                title:'商品名称',
                name:'productName'
              },{
                title:'商品数量',
                name:'productTotalNum'
              }],
          },
          {
            cols:[
              {
                title:'商户名称',
                name:'merchantName'
              },{
                title:'商户号',
                name:'merchantNo'
              },{
                title:'订单来源',
                name:'orderSource',
                render: '',
              }],
          },
          {
            cols:[
              {
                title:'来源商户号',
                name:'merchantSourceNo'
              },{
                title:'来源用户标识',
                name:'userSourceNo'
              },{
                title:'支付场景',
                name:'payScene'
              }],
          },
          {
            cols:[
              {
                title:'清算类型',
                name:'auditType',
                render: '',
              },{
                title:'第三方支付流水',
                name:'thirdPartyNo'
              },{
                title:'第三方支付时间',
                name:'thirdPartyPayTime'
              }],
          },
          {
            cols:[
              {
                title:'手续费',
                name:'thirdPartyFee',
                render: (h, params) => {
                  return h('span', this.common.formatNumber(params.thirdPartyFee))
                }
              },{
                title:'备注',
                name:'extra',
                colspan:"3"
              }],
          }],
        tableUrl:'/payorder/detail/'+this.$route.query.id,
        tableParams:{},

        refundOrderDetail: [],
        columns: [
          {
            title: '退款申请时间',
            align: 'center',
            key: 'orderTime'
          },
          {
            title: '退款单号',
            align: 'center',
            key: 'refundOrderNo',
            render: (h, params) => {
              const actions = [
                {
                  title: params.row.refundOrderNo,
                  type:'a',
                  action:()=>{
                    let href = this.$router.resolve({
                      path:'/order/orderQuery/refundOrderDetail',
                      query:{
                        id:params.row.id,
                        // refundOrderNo:params.row.refundOrderNo,
                        // orderNo:params.row.orderNo,
                        // orderSource:params.row.orderSource,
                        // merchantNo:this.orderInfo.merchantNo,
                        // merchantSourceNo:this.orderInfo.merchantSourceNo
                      }
                    }).href;
                    window.open(href, '_blank');
                  }
                },
              ];
              return this.common.columnsItemRender(h, actions);
            }
          },
          {
            title: '退款金额',
            align: 'center',
            key: 'refundAmount',
          },
          {
            title: '支付流水号',
            align: 'center',
            key: 'payNo',
          },
          {
            title: '支付时间',
            align: 'center',
            key: 'payTime',
          }
        ],
        orderInfo:{

        },
        loading:false,
        abnormalRefundForm:false,
        abnormalRefundUrl:'/abnormalRefund',
        abnormalRefundFormItems: [
        {
          title: '退款原因',
          name: 'desc',
          type: 'textarea',
          rules: [
            {required: true, message: '请输入退款原因', trigger: 'blur'},
            {max: 200, message: "退款原因不超过200字符", trigger: 'blur'}
          ],
          autosize: {
            minRows: 4,maxRows: 7
          },
          value: ""
        }
      ],
      }
    },
    watch: {
    },
    created(){
      // 获取清算类型
      this.getAuditType()
      // 根据订单号和订单来源查询支付订单详情
      // this.getOrderByOrderNo()
      // 获取支付状态
      this.getPayStatus()
      // 获取订单来源
      this.getMerchantSource()
    },
    methods:{
      beforeSave(params){
        params.payNo = this.orderInfo.payNo
      },
      onSuccess(res){
        // if(res.success){
        //   this.$Message.success(res.message)
        // }else{
        //   this.$Message.warning(res.message)
        // }
      },
      // 补偿通知
      compensateNotice(){
        let apiPrefix = this.apiPrefix
        let url = '/notify'
        let params = {
          payNo:this.orderInfo.payNo,
        }
        this.apiPost(url,params,apiPrefix).then(res=>{
          if(res.success){
            this.$Message.success(res.message)
          }else{
            this.$Message.warning(res.message)
          }
        })
      },
      // 异常退款
      abnormalRefund(){
        this.abnormalRefundForm = true
      },
      // 获取订单明细后
      onGetAfter(orderInfo){
        this.refundOrderDetail = orderInfo.refundOrders
        this.orderInfo = orderInfo
      },
      // 状态同步
      orderSync(){
        this.loading = true
        let url = '/payorder/synch'
        let params = {
          payNo:this.orderInfo.payNo,
        }
        this.apiPost(url,params).then(res=>{
          this.loading = false
          if(res.status == 200){
            this.$Message.info(res.message || '同步成功！')
            // 更新详情
            this.$refs.myTable.getDetail()
          }
        })
      },
      // 获取清算类型
      getAuditType(){
        this.$store.dispatch("getAuditType").then(res=>{
          this.tableRows[6].cols[0].render = (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.auditType])
          }
        })
      },
      // 根据订单号和订单来源查询支付订单详情
      // getOrderByOrderNo(){
      //   let {orderNo,orderSource,merchantNo}= this.$route.query
      //   if(orderNo && orderSource && merchantNo){
      //       this.tableUrl = '/payorder/detail'
      //       this.tableParams = this.$route.query
      //   }
      // },
      // 获取支付状态
      getPayStatus(){
        this.$store.dispatch("getPayStatus").then(res=>{
          this.tableRows[1].cols[1].render = (h, params) => {
            let actions = [
              {
                title: this.common.arrayTurnObj(res)[params.payStatus],
                type:'text',
              },
            ];
            if(params.payStatus ==11){
              // 支付中时
              actions.push({
                title: "状态同步",
                type:'Button',
                loading:this.loading,
                action: () => {
                  this.orderSync()
                }
              })
            }
            return this.common.columnsItemRender(h, actions);
          }
        })
      },
      // 获取订单来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          this.tableRows[4].cols[2].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.orderSource])
          }
        })
      },
      // 返回
      back(){
        if (window.history.length>1) {
          this.$router.back()
        }else{
          // this.$router.replace({
          //   path: "/order/orderQuery/refundOrderDetail",
          //   query:{
          //     refundOrderNo:this.orderInfo.refundOrderNo,
          //     orderSource:this.orderInfo.orderSource,
          //     merchantSourceNo:this.orderInfo.merchantSourceNo
          //   },
          //
          // });
          this.$router.push({
            path: "/order/orderQuery/tradeOrderQuery",
          });
        }
      }
    }
  }
</script>
<style scoped>
  .table-title-box{
    overflow: hidden;
  }
  .table-title {
    padding: 5px 0;
    font-size: 14px;
    display: inline-block;
  }
  .bottom-btn-box {
    margin-top: 20px;
    text-align: center;
  }
  .table-title-refund{
    padding: 25px 0 10px;
  }
</style>

<template>
  <div style="width: 80%;margin: 0 auto">
    <h4 class="table-title">退款订单信息</h4>
    <myTable ref="myTable"
             :tableRows="tableRows"
             :url="tableUrl"
             :params="tableParams"
             @onGetAfter="onGetAfter"></myTable>
    <div class="bottom-btn-box">
      <Button @click='back' type="primary">返回</Button>
    </div>
  </div>
</template>
<script>
  import myTable from "@/components/global/myTable";
  export default {
    components: {myTable},
    data () {
      return {
        tableRows: [
          {
            cols:[
              {
              title:'退款单号',
              name:'refundOrderNo'
            },
              {
              title:'退款申请时间',
              name:'orderTime'
            },
              {
              title:'支付流水号',
              name:'payNo'
            }],
          },
          {
            cols:[
              {
                title:'支付时间',
                name:'payTime'
              },
              {
                title:'退款金额（元）',
                name:'refundAmount',
                render: (h, params) => {
                  return h('span', this.common.formatNumber(params.refundAmount))
                }
              },
              {
                title:'退款状态',
                name:'payStatus',
                render: ''
              }],
          },
          {
            cols:[
              {
                title:'订单编号',
                name:'orderNo',
                render:(h, params) => {
                  const actions = [
                    {
                      title: params.orderNo,
                      type:'a',
                      action:()=>{
                        let href = this.$router.resolve({
                          path:'/order/orderQuery/tradeOrderDetail',
                          query:{
                            id:this.orderInfo.payOrderId,
                            // orderNo:params.orderNo,
                            // orderSource:params.orderSource,
                            // merchantNo:this.orderInfo.merchantNo,
                            // merchantSourceNo:params.merchantSourceNo
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
                title:'实付金额（元）',
                name:'payAmount',
                render: (h, params) => {
                  return h('span', this.common.formatNumber(params.payAmount))
                }
              },
              {
                title:'支付渠道',
                name:'channelName'
              }],
          },
          {
            cols:[
              {
                title:'订单来源',
                name:'orderSource',
                render:'',
              },
              {
                title:'来源商户号标识',
                name:'merchantSourceNo'
              },
              {
                title:'来源用户标识',
                name:'userSourceNo'
              }],
          },
          {
            cols:[
              {
                title:'商户号',
                name:'merchantNo'
              },
              {
                title:'商户名称',
                name:'merchantName'
              },
              {
                title:'第三方支付流水',
                name:'thirdPartyNo'
              }],
          },
          {
            cols:[
              {
                title:'第三方支付时间',
                name:'thirdPartyPayTime'
              },{
                title:'创建时间',
                name:'createTime'
              },{
                title:'最近更新时间',
                name:'modifyTime'
              }],
          },
          {
            cols:[
              {
                title:'备注',
                name:'extra',
                colspan:"5"
              }],
          }],
        tableUrl:"/refundorder/detail/"+this.$route.query.id,
        tableParams:{},
        orderInfo:{},
        loading:false
      }
    },
    watch: {

    },
    created(){
      // 根据订单号和订单来源查询支付订单详情
      // this.getOrderByOrderNo()
      // 获取退款状态
      this.getRefundStatus()
      // 获取订单来源
      this.getMerchantSource()
    },
    methods:{
      // 获取订单明细后
      onGetAfter(orderInfo){
        this.orderInfo = orderInfo
      },
      // 根据订单号和订单来源查询支付订单详情
      // getOrderByOrderNo(){
      //   let {refundOrderNo,orderNo,orderSource,merchantNo}= this.$route.query
      //   if(refundOrderNo && orderSource && merchantNo){
      //     this.tableUrl = '/refundorder/detail'
      //     this.tableParams = this.$route.query
      //   }
      // },
      // 获取退款状态
      getRefundStatus(){
        this.$store.dispatch("getRefundStatus").then(res=>{
          this.tableRows[1].cols[2].render = (h, params) => {
            let actions = [
              {
                title: this.common.arrayTurnObj(res)[params.payStatus],
                type:'text',
              },
            ];
            if(params.payStatus == '21'){
              // 退款中时
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
          this.tableRows[3].cols[0].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.orderSource])
          }
        })
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
      // 返回
      back(){
        if (window.history.length>1) {
          this.$router.back()
        }else{
          // this.$router.replace({
          //   path: "/order/orderQuery/tradeOrderDetail",
          //   query:{
          //     orderNo:this.orderInfo.orderNo,
          //     orderSource:this.orderInfo.orderSource,
          //     merchantSourceNo:this.orderInfo.merchantSourceNo
          //   }
          // });
          this.$router.push({
            path: "/order/orderQuery/refundOrderQuery",
          });
        }
      }
    }
  }
</script>
<style scoped>
  .table-title {
    padding: 5px 0;
    font-size: 14px;
  }
  .bottom-btn-box {
    margin-top: 20px;
    text-align: center;
  }
</style>

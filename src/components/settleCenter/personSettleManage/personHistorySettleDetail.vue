<template>
  <div style="width: 80%;margin: 0 auto">
    <h4 class="table-title">收款和付款信息</h4>
    <myTable ref="myTable"
             :tableRows="tableRows"
             :url="tableUrl"
             :params="tableParams"
              @onGetAfter="onGetAfter"></myTable>

    <h4 class="table-title table-title-refund">结算明细</h4>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :hannleItems="[]"></list>

    <div class="bottom-btn-box">
      <Button @click='$router.back()' type="primary">返回</Button>
    </div>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import myTable from "@/components/global/myTable";
  export default {
    components: {myTable,list},
    data () {
      return {
        tableRows: [
          {
            cols:[
              {
              title:'收款商户名称',
              name:'orderNo'
            },{
              title:'付款银行',
              name:'orderTime'
            }],
          },
          {
            cols:[
              {
                title:'证件号',
                name:'orderNo'
              },{
                title:'付款银行户名',
                name:'orderTime'
              }],
          },
          {
            cols:[
              {
                title:'收款银行',
                name:'payTime'
              },{
                title:'付款银行账号',
                name:'payStatus',
                render: ''
              }],
          },
          {
            cols:[
              {
                title:'收款银行户名',
                name:'payAmount'
              },{
                title:'结算金额',
                name:'payProductName'
              }],
          },
          {
            cols:[
              {
                title:'收款银行账号',
                name:'productCode'
              },{
                title:'转账批次号',
                name:'productName'
              }],
          },
          {
            cols:[
              {
                title:'操作员',
                name:'merchantName'
              },{
                title:'结算时间',
                name:'merchantNo'
              }],
          },
          {
            cols:[
              {
                title:'状态',
                name:'merchantSourceNo'
              },{
                title:'',
                name:''
              }],
          }],
        tableUrl:'/payorder/detail/'+this.$route.query.id,
        tableParams:{},

        refundOrderDetail: [],
        columns: [
          {
            title: '小鲸订单号',
            align: 'center',
            key: 'orderTime'
          },
          {
            title: '业务订单号',
            align: 'center',
            key: 'refundOrderNo',
          },
          {
            title: '分账明细编号',
            align: 'center',
            key: 'refundAmount',
          },
          {
            title: '订单实付金额',
            align: 'center',
            key: 'payNo',
          },
          {
            title: '待结算金额',
            align: 'center',
            key: 'payTime',
          },
          {
            title: '订单成功时间',
            align: 'center',
            key: 'payTime',
          },
          {
            title: '来源商户名称',
            align: 'center',
            key: 'payTime',
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/payorder/grid',

        orderInfo:{},
        loading:false,
      }
    },
    watch: {
    },
    created(){
      // 根据订单号和订单来源查询支付订单详情
      this.getOrderByOrderNo()
    },
    methods:{
      // 获取订单明细后
      onGetAfter(orderInfo){
        this.refundOrderDetail = orderInfo.refundOrders
        this.orderInfo = orderInfo
      },
      // 根据订单号和订单来源查询支付订单详情
      getOrderByOrderNo(){
        let {orderNo,orderSource,merchantSourceNo}= this.$route.query
        if(orderNo && orderSource && merchantSourceNo){
            this.tableUrl = '/payorder/detail'
            this.tableParams = {orderNo,orderSource,merchantSourceNo}
        }
      }
    }
  }
</script>
<style scoped>
  .table-title {
    padding-bottom: 15px;
    font-size: 14px;
  }
  .bottom-btn-box {
    margin-top: 20px;
    text-align: center;
  }
  .table-title-refund{
    padding-top: 15px;
    padding-bottom: 0;
    margin-bottom: -5px;
  }
</style>

<template>
  <div style="width: 80%;margin: 0 auto">
    <h4 class="table-title">订单信息</h4>
    <myTable :tableRows="tableRows"></myTable>

    <h4 class="table-title ptop">退款信息</h4>
    <Table border
           size="small"
           :columns="columns"
           :data="orderDetail"></Table>
    <div class="bottom-btn-box">
      <Button @click='$router.back()' type="primary">返回</Button>
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
              title:'订单编号',
              name:'orderNo1'
            },{
              title:'下单时间',
              name:'orderNo2'
            },{
              title:'支付流水号',
              name:'orderNo3'
            }],
          },
          {
            cols:[
              {
                title:'支付时间',
                name:'orderNo1'
              },{
                title:'订单状态',
                name:'orderNo2',
                render: (h, params) => {
                  const actions = [
                    {
                      title: params.name,
                      type:'text',
                    },
                    {
                      title: "状态同步",
                      type:'Button',
                      action: () => {
                        this.$router.push({
                          path: "/merchant/merchant2/merchantAddEditDetail",
                          query: { id: params.row.id,routeType:"detail"}
                        });
                      }
                    },
                  ];
                  return this.common.columnsItemRender(h, actions);
                }
              },{
                title:'订单金额（元）',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'订单实付金额（元）',
                name:'orderNo1'
              },{
                title:'支付产品',
                name:'orderNo2'
              },{
                title:'支付渠道',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'商品编码',
                name:'orderNo1'
              },{
                title:'商品名称',
                name:'orderNo2'
              },{
                title:'商品数量',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'商户名称',
                name:'orderNo1'
              },{
                title:'商户号',
                name:'orderNo2'
              },{
                title:'订单来源',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'来源商户号',
                name:'orderNo1'
              },{
                title:'来源用户标识',
                name:'orderNo2'
              },{
                title:'支付场景',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'清算类型',
                name:'orderNo1'
              },{
                title:'第三方支付流水',
                name:'orderNo2'
              },{
                title:'第三方支付时间',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'手续费',
                name:'orderNo1'
              },{
                title:'备注',
                name:'orderNo2',
                colspan:"3"
              }],
          }],
        orderDetail: [],
        columns: [
          {
            title: '退款申请时间',
            align: 'center',
            key: 'linkMan'
          },
          {
            title: '退款单号',
            align: 'center',
            key: 'idcardNo'
          },
          {
            title: '退款金额',
            align: 'center',
            key: 'checked',
            render: (h, params) => {
              let text = '未消费'
              if (params.row.checked === 'T') {
                text = '已消费'
              }
              if (params.row.refunded === 'T') {
                text = '已退票'
              }
              return h('span', text)
            }
          },
          {
            title: '支付流水号',
            align: 'center',
            key: 'checked',
            render: (h, params) => {
              let text = '未消费'
              if (params.row.checked === 'T') {
                text = '已消费'
              }
              if (params.row.refunded === 'T') {
                text = '已退票'
              }
              return h('span', text)
            }
          },
          {
            title: '支付时间',
            align: 'center',
            key: 'checked',
            render: (h, params) => {
              let text = '未消费'
              if (params.row.checked === 'T') {
                text = '已消费'
              }
              if (params.row.refunded === 'T') {
                text = '已退票'
              }
              return h('span', text)
            }
          }
        ]
      }
    },
    props: ['result', 'searchType'],
    watch: {
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

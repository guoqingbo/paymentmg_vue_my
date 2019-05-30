<template>
  <div style="width: 80%;margin: 0 auto">
    <h4 class="table-title">退款订单信息</h4>
    <myTable :tableRows="tableRows"
             btnShow="true"
             :url="tableUrl"></myTable>
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
              name:'orderNo1'
            },
              {
              title:'退款申请时间',
              name:'orderNo2'
            },
              {
              title:'支付流水号',
              name:'orderNo3'
            }],
          },
          {
            cols:[
              {
                title:'支付时间',
                name:'orderNo1'
              },
              {
                title:'退款金额（元）',
                name:'orderNo1'
              },
              {
                title:'退款状态',
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
              }],
          },
          {
            cols:[
              {
                title:'订单编号（元）',
                name:'orderNo1',
                render: (h, params) => {
                  const actions = [
                    {
                      title: params.name,
                      type:'router',
                      to:{
                        path:"/order/orderQuery/tradeOrderDetail",
                        query:{orderNo:params.orderNo}
                      }
                    },
                  ];
                  return this.common.columnsItemRender(h, actions);
                }
              },
              {
                title:'订单实付金额（元）',
                name:'orderNo2'
              },
              {
                title:'支付渠道',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'订单来源',
                name:'orderNo1'
              },
              {
                title:'来源商户号标识',
                name:'orderNo2'
              },
              {
                title:'来源用户标识',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'商户号',
                name:'orderNo2'
              },
              {
                title:'商户名称',
                name:'orderNo1'
              },
              {
                title:'第三方支付流水',
                name:'orderNo3'
              }],
          },
          {
            cols:[
              {
                title:'第三方支付时间',
                name:'orderNo1'
              },{
                title:'创建时间',
                name:'orderNo2'
              },{
                title:'最近更新时间',
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
                title:'备注',
                name:'orderNo2',
                colspan:"5"
              }],
          }],
        tableUrl:"/ddd"
      }
    },
    watch: {
    }
  }
</script>
<style scoped>
  .table-title {
    padding: 5px 0;
    font-size: 14px;
  }
</style>

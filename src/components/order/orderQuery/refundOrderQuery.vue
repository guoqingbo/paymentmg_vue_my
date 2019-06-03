<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
  </div>
</template>
<script>
  import { apiGet, apiPost } from '@/fetch/api'
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index'
          },
          {
            title: '退款申请时间',
            key: 'orderTime',
            sortable: true,
          },
          {
            title: '原订单号',
            key: 'orderNo',
            sortable: true,
          },
          {
            title: '退款订单号',
            key: 'refundOrderNo',
            sortable: true,
          },
          {
            title: '支付流水号',
            key: 'payNo',
            sortable: true,
          },
          {
            title: '订单实付金额',
            key: 'payAmount',
            sortable: true,
          },
          {
            title: '退款金额',
            key: 'refundAmount',
            sortable: true,
          },
          {
            title: '退款状态',
            key: 'payStatus',
            sortable: true,
            render: ''
          },
          {
            title: '商户名称',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '商户号',
            key: 'merchantNo',
            sortable: true,
          },
          {
            title: '订单来源',
            key: 'orderSource',
            sortable: true,
            render: ''
          },
          {
            title: '支付渠道',
            key: 'channelCode',
            sortable: true,
            render: ''
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                {
                  title: "明细",
                  action: () => {
                    this.$router.push({
                      path: "/order/orderQuery/refundOrderDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    });
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {},
        url: '/refundorder/grid',
        searchItems: [
          {
            label: '退款单号',
            type: 'input',
            name: 'refundOrderNo'
          },
          {
            label: '原订单号',
            type: 'input',
            name: 'orderNo'
          },
          {
            label: '支付流水号',
            type: 'input',
            name: 'payNo'
          },
          {
            label: '起始日期',
            type: 'date',
            name: 'orderTimeStart',
            format:'yyyy-MM-dd 00:00:00',
            value: new Date(new Date().setMonth(new Date().getMonth()-1))
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'orderTimeEnd',
            format:'yyyy-MM-dd 23:59:59',
            value: new Date()
          },
          {
            label: '来源',
            type: 'select',
            name: 'orderSource',
            data: ''
          },
          {
            label: '支付渠道',
            type: 'select',
            name: 'channelCode',
            data: ''
          },
          {
            label: '商户号',
            type: 'input',
            name: 'merchantNo'
          },
          {
            label: '退款状态',
            type: 'select',
            name: 'payStatus',
            data: ''
          },
        ],
        hannleItems: [
          {
            title: '导出',
            type: 'success',
            loading: false,
            callback: () => {
              this.hannleItems[0].loading = true
              let url = ''
              this.common.exportData('交易订单', url, () => {
                this.hannleItems[0].loading = false
              }, this)
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",
      }
    },
    mounted () {

    },
    created(){
      // 获取退款状态
      this.getRefundStatus()
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getChannel()
    },
    components: {list,confirm},
    methods: {
      // 获取退款状态
      getRefundStatus(){
        this.$store.dispatch("getRefundStatus").then(res=>{
          this.columns[7].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.row.payStatus])
          }
          this.searchItems[8].data = res
        })
      },
      // 获取订单来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          this.columns[10].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.row.orderSource])
          }
          this.searchItems[5].data = res
        })
      },
      // 获取支付渠道
      getChannel(){
        this.$store.dispatch("getChannel").then(res=>{
          this.columns[11].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.row.channelCode])
          }
          this.searchItems[6].data = res
        })
      }
    }
  }
</script>

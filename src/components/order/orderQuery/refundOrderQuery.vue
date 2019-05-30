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
            key: 'merchantCode',
            sortable: true,
          },
          {
            title: '原订单号',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '退款订单号',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '支付流水号',
            key: 'merchantType',
            sortable: true,
          },
          {
            title: '订单实付金额',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '退款金额',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '退款状态',
            key: 'createTime',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("merchantType",params.row.merchantType))
            }
          },
          {
            title: '商户名称',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '商户号',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '订单来源',
            key: 'createTime',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("merchantType",params.row.merchantType))
            }
          },
          {
            title: '支付渠道',
            key: 'createTime',
            sortable: true,
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
        url: '/merchant/grid',
        searchItems: [
          {
            label: '退款单号',
            type: 'input',
            name: 'merchantName'
          },
          {
            label: '原订单号',
            type: 'input',
            name: 'merchantName'
          },
          {
            label: '支付流水号',
            type: 'input',
            name: 'merchantCode'
          },
          {
            label: '起始日期',
            type: 'date',
            name: 'startDate',
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            value: ''
          },
          {
            label: '来源',
            type: 'select',
            name: 'source',
            data: ''
          },
          {
            label: '支付渠道',
            type: 'select',
            name: 'source',
            data: ''
          },
          {
            label: '商户号',
            type: 'input',
            name: 'merchantCode'
          },
          {
            label: '退款状态',
            type: 'select',
            name: 'source',
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
    components: {list,confirm},
    methods: {

    }
  }
</script>

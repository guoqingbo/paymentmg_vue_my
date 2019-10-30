<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          @beforeSubmit="beforeSubmit"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  export default {
    data () {
      return {
        columns: [
          {
            title: '订单编号',
            key: 'orderNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算总金额（元）',
            key: 'splitAmount',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.splitAmount))
            }
          },
          {
            title: '业务结算流水号',
            key: 'splitNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '子订单编号',
            key: 'subOrderNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '业务商户编号',
            key: 'subMerchantNo',
            // sortable: true,
            align:'subMerchantNo'
          },
          {
            title: '渠道商户编号',
            key: 'subMerchantSourceNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算金额（元）',
            key: 'amount',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.amount))
            }
          },
          {
            title: '费用类型',
            key: 'splitType',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.filter.turn("splitType",params.row.splitType))
            }
          },
          {
            title: '结算状态',
            key: 'status',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.filter.turn("busiStatus",params.row.status))
            }
          },
          {
            title: '备注',
            key: 'remark',
            // sortable: true,
            align:'center'
          },
          {
            title: '失败原因',
            key: 'errMsg',
            // sortable: true,
            align:'center'
          },
        ],
        params: {
          // sort:'modifyTime',
          // order:'desc',
          batchNo:this.$route.query.batchNo,
        },
        url: '/splitSubMerchant/grid',
        searchItems: [
          {
            label: '订单编号',
            type: 'input',
            name: 'orderNo'
          },
          {
            label: '子订单编号',
            type: 'input',
            name: 'subOrderNo'
          },
          {
            label: '状态',
            type: 'select',
            name: 'status',
            data: this.common.dic.busiStatus,
            value:"all",
          },
        ],
        hannleItems: [

        ]
      }
    },
    computed:{

    },
    created(){
      // 更新位置占位符
      this.$store.dispatch('setBreadcrumbListAction', ['渠道分账查询', '查看明细'])
    },
    mounted () {

    },
    components: {list},
    methods: {
      // 搜索之前
      beforeSubmit(params){
        if(params.status=='all'){
          params.status = ''
        }
      },
    }
  }
</script>

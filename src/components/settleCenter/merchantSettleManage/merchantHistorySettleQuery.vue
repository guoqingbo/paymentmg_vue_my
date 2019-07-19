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
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index',
            width:60,
            align:'center'
          },
          {
            title: '结算订单号',
            key: 'orderTime',
            sortable: true,
          },
          {
            title: '支付中心商户号',
            key: 'orderNo',
            sortable: true,
          },
          {
            title: '商户名称',
            key: 'payNo',
            sortable: true,
          },
          {
            title: '付款银行',
            key: 'orderAmount',
            sortable: true,
          },
          {
            title: '付款银行账号',
            key: 'payAmount',
            sortable: true,
          },
          {
            title: '收款银行名称',
            key: 'payStatus',
            sortable: true,
            render:''
          },
          {
            title: '收款银行户名',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '收款银行账号',
            key: 'orderSource',
            sortable: true,
            render:"",
          },
          {
            title: '待结算金额',
            key: 'channelName',
            sortable: true,
          },
          {
            title: '状态',
            key: 'channelName',
            sortable: true,
          },
          {
            title: '结算日期',
            key: 'channelName',
            sortable: true,
          },
          {
            title: '操作员',
            key: 'channelName',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const actions = [
                {
                  title: "查看",
                  action: () => {
                    this.$router.push({
                      path: "/settleCenter/merchantSettleManage/merchantHistorySettleDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    });
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/payorder/grid',
        searchItems: [
          {
            label: '商户名称',
            type: 'input',
            name: 'merchantName'
          },
          {
            label: '开始日期',
            type: 'date',
            name: 'startDate',
            format:'yyyy-MM-dd 00:00:00',
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd 23:59:59',
            value: ''
          },
        ],
        hannleItems:[],
        mode: "",
        content: "",
        sucessMsg: "",
      }
    },
    mounted () {

    },
    components: {list,confirm},
    created(){

    },
    methods: {

    }
  }
</script>

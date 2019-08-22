<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          @beforeSubmit="beforeSubmit"
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
            width:70,
            align:'center'
          },
          {
            title: '结算订单号',
            key: 'orderTime',
          },
          {
            title: '支付中心商户号',
            key: 'orderNo',
          },
          {
            title: '姓名',
            key: 'payNo',
          },
          {
            title: '证件号',
            key: 'payNo',
          },
          {
            title: '付款银行',
            key: 'orderAmount',
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
                      path: "/settleCenter/personSettleManage/personHistorySettleDetail",
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
            type: 'autoComplete',
            name: 'merchantName',
            data:[],
            search: (value)=>{
              this.common.searchMerchantList(value,this.searchItems[0])
            }
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
      // 日期限制
      this.checkDate()
    },
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.searchItems[1]
        let endDateItem = this.searchItems[2]
        if(startDateItem && endDateItem){
          startDateItem.onChange=(date1)=>{
            endDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()<new Date(this.common.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endDateItem.onChange=(date1)=>{
            startDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()>new Date(this.common.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
        }
      }
    }
  }
</script>

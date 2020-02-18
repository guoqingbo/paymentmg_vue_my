<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          @beforeSubmit="beforeSubmit"
          :hannleItems="hannleItems"
          :apiPrefix="apiPrefix"
          :exportItem="exportItem"></list>
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
        apiPrefix:this.common.config.apiReport,
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '商户号',
            key: 'merchantNo',
          },
          {
            title: '商户名称',
            key: 'merchantName',
          },
          {
            title: '企业码',
            key: 'merchantName',
          },
          {
            title: '交易笔数',
            key: 'merchantName',
          },
          {
            title: '交易金额',
            key: 'orderAmount',
            sortable: true,
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.orderAmount))
            }
          },
          {
            title: '退款笔数',
            key: 'merchantName',
          },
          {
            title: '退款金额',
            key: 'orderAmount',
            sortable: true,
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.orderAmount))
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/tradestatistics/grid',
        searchItems: [
          {
            label: '商户名称',
            name: 'merchantNo',
            type: 'autoComplete',
            value: '',
            data:[],
            search: (value)=>{
              this.common.searchMerchantList(value,this.searchItems[4])
            }
          },
          // {
          //   label: '商户号',
          //   name: 'merchantNo',
          //   type: 'hidden',
          //   data:[],
          // },
          {
            label: '起始日期',
            type: 'date',
            name: 'orderTimeStart',
            format:'yyyy-MM-dd',
            // value: new Date(new Date().setMonth(new Date().getMonth()-1)),
            options:{}
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'orderTimeEnd',
            format:'yyyy-MM-dd',
            // value: new Date(),
            options:{}
          },

        ],
        hannleItems:[],
        exportItem: {
            title: '导出',
            type: 'success',
            loading: false,
            callback: () => {
              this.exportItem.loading = true
              let url = '/tradestatistics/export';
              let params = this.$store.state.list.params
              this.common.exportData({
                url,
                params,
                text:'交易订单',
                callback:()=>{
                  this.exportItem.loading = false
                }
              })
            }
        },
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
        let startDateItem = this.searchItems[2]
        let endDateItem = this.searchItems[3]
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

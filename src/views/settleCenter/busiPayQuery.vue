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
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '业务批次号',
            key: 'outBatchNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '核销日期',
            key: 'checkDate',
            // sortable: true,
            align:'center'
          },
          {
            title: '分账渠道',
            key: 'channelName',
            // sortable: true,
            align:'center'
          },
          {
            title: '分账渠道代码',
            key: 'splitProductCode',
            // sortable: true,
            align:'center'
          },
          {
            title: '商户名称',
            key: 'merchantName',
            // sortable: true,
            align:'center'
          },
          {
            title: '订单笔数',
            key: 'totalCount',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算总金额（元）',
            key: 'totalAmount',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              // params.row.status
              return h('span', this.common.formatNumber(params.row.totalAmount))
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            // sortable: true,
            align:'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 130,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title: "查看",
                  action: () => {
                    this.$router.push({
                      path:"/settleCenter/busiPayLook",
                      query:{
                        outBatchNo:params.row.outBatchNo,
                        merchantNo:params.row.merchantNo
                      }
                    })
                  }
                },
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          sort:'checkDate',
          order:'desc'
        },
        url: '/splitCustomerOrder/grid',
        searchItems: [
          {
            label: '开始日期',
            type: 'date',
            name: 'startDate',
            format:'yyyy-MM-dd',
            options:{},
            value: ''
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd',
            options:{},
            value: ''
          },
          {
            label: '商户名称',
            type: 'autoComplete',
            name: 'merchantNo',
            data:[],
            search: (value)=>{
              let arrItem = this.common.getArrItem(this.searchItems,'merchantNo')
              this.common.searchMerchantList(value,arrItem)
            }
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

        ],
      }
    },
    computed:{

    },
    created(){
      // 日期限制
      this.checkDate()
    },
    mounted () {

    },
    components: {list},
    methods: {
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.common.getArrItem(this.searchItems,'startDate')
        let endDateItem = this.common.getArrItem(this.searchItems,'endDate')
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
      },
      // 搜索之前
      beforeSubmit(params){
        if(params.status=='all'){
          params.status = ''
        }
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      }
    }
  }
</script>

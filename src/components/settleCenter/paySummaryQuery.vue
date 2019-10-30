<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          @beforeSubmit="beforeSubmit"
          :params="params"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <Modal v-model="lookModal"
           title="商户结算汇总"
           width="750">
      <Table style="position:static;" stripe  :columns="lookColumns" :data="lookRows"></Table>
      <div slot="footer">
        <div>
          <Button type="primary"
                  @click="lookModal=false"
          >关闭
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  export default {
    data () {
      return {
        lookModal:false,
        lookColumns:[
          {
            title: '业务商户编号',
            key: 'subMerchantNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '渠道商户编号',
            key: 'subMerchantSourceNo',
            // sortable: true,
            align:'center'
          },
          {
            title: '结算金额（元）',
            key: 'sumAmount',
            // sortable: true,
            align:'center',
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.sumAmount))
            }
          },
        ],
        lookRows:[],
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '商户名称',
            key: 'merchantName',
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
              return h('span', this.common.formatNumber(params.row.totalAmount))
            }
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
                    this.merchantPaySummarry(params.row)
                    this.lookModal = true
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
        url: '/splitStatistics/total',
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
            label: '商户简称',
            type: 'autoComplete',
            name: 'merchantNo',
            data:[],
            search: (value)=>{
              this.common.searchMerchantList(value,this.searchItems[2])
            }
          }
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
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 商户结算汇总列表
      merchantPaySummarry(row){
        let url = "/splitStatistics/detail"
        let params = {
          merchantNo:row.merchantNo,
          checkDate:row.checkDate,
        }
        this.apiGet(url,params).then(res=>{
          if(res.success){
            this.lookRows = res.data
          }else{
            this.lookRows = []
          }
        })
      }
    }
  }
</script>

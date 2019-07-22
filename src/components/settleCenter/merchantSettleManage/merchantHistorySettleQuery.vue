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
            type: 'autoComplete',
            name: 'merchantName',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,2)
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
      // 商户信息模糊查询
      searchMerchantList(keyword,columnType){
        // columnType，1:code查询，2:name查询
        if(keyword && columnType){
          let params = {
            vagueMerchantMark:keyword,
            columnType,
          }
          let url = '/merchant/queryMerchantListByVagueMerchantMark'
          this.apiGet(url,params).then(res=>{
            if(res.status == 200){
              let data = []
              if(res.data.length){
                res.data.forEach(ele=>{
                  if(columnType == 1){
                    // 1:code查询
                    data.push({label:ele.merchantCode,value:ele.merchantCode})
                  }else{
                    // 2:name查询
                    data.push({label:ele.merchantName,value:ele.merchantName})
                  }

                })
              }else{
                data = [{label:'暂无数据',value:''}]
              }
              if(columnType == 1){
                this.searchItems[1].data = data
              }else{
                this.searchItems[0].data = data
              }
            }
          })
        }
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
              if(date2.getTime()<new Date(this.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endDateItem.onChange=(date1)=>{
            startDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()>new Date(this.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
        }
      },
      // 日期转为时间戳，如果不带时分秒，则存在时差
      formateDateStr(str){
        if(str.length <19){
          str += ' 00:00:00'.substring(10-str.length)
        }
        return str
      }
    }
  }
</script>

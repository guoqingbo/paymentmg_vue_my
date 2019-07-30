<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
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
  import qs from 'qs'
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
            title: '实付金额',
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
            width:90,
            align:'center',
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
        params: {
          sort:'modifyTime',
          order:'desc'
        },
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
            name: 'merchantNo',
            type: 'autoComplete',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,1)
            }
          },
          {
            label: '退款状态',
            type: 'select',
            name: 'payStatus',
            data: ''
          },
        ],
        exportItem: {
            title: '导出',
            type: 'success',
            loading: false,
            callback: () => {
              this.exportItem.loading = true
              let url = '/refundorder/export';
              let params = this.$store.state.list.params

              this.common.exportData({
                url,
                params,
                text:'退款订单',
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
    created(){
      // 获取退款状态
      this.getRefundStatus()
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getChannel()
      // 日期限制
      this.checkDate()
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
      },
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
                this.searchItems[7].data = data
              }
            }
          })
        }
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.searchItems[3]
        let endDateItem = this.searchItems[4]
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

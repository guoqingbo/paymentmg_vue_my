<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          @beforeSubmit="beforeSubmit"
          :hannleItems="hannleItems"
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
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '下单时间',
            key: 'orderTime',
            sortable: true,
          },
          {
            title: '订单编号',
            key: 'orderNo',
            sortable: true,
          },
          {
            title: '支付流水号',
            key: 'payNo',
            sortable: true,
          },
          {
            title: '订单金额',
            key: 'orderAmount',
            sortable: true,
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.orderAmount))
            }
          },
          {
            title: '实付金额',
            key: 'payAmount',
            sortable: true,
            render: (h, params) => {
              return h('span', this.common.formatNumber(params.row.payAmount))
            }
          },
          {
            title: '支付状态',
            key: 'payStatus',
            sortable: true,
            render:''
          },
          {
            title: '商户名称',
            key: 'merchantName',
            sortable: true,
          },
          {
            title: '订单来源',
            key: 'orderSource',
            sortable: true,
            render:"",
          },
          {
            title: '支付渠道',
            key: 'channelName',
            sortable: true,
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
                  auth:'tradeOrderDetail',
                  action: () => {
                    // this.$router.push({
                    //   path: "/order/orderQuery/tradeOrderDetail",
                    //   query: { id: params.row.id,routeType:"detail"}
                    // });
                    // 新窗口打开
                    let href = this.$router.resolve({
                      path: "/order/orderQuery/tradeOrderDetail",
                      query: { id: params.row.id,routeType:"detail"}
                    }).href;
                    window.open(href, '_blank');
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
            label: '订单号',
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
            format:'yyyy-MM-dd',
            value: new Date(new Date().setMonth(new Date().getMonth()-1)),
            options:{}
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'orderTimeEnd',
            format:'yyyy-MM-dd',
            value: new Date(),
            options:{}
          },
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
            label: '支付状态',
            type: 'select',
            name: 'payStatus',
            data: ''
          },
          {
            label: '订单来源',
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
        ],
        hannleItems:[],
        exportItem: {
            title: '导出',
            type: 'success',
            loading: false,
            callback: () => {
              this.exportItem.loading = true
              let url = '/payorder/export';
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
      // 获取支付状态
      this.getPayStatus()
      // 获取订单来源
      this.getMerchantSource()
      // 获取支付渠道
      this.getChannel()
      // 日期限制
      this.checkDate()
    },
    methods: {
      // 搜索之前
      beforeSubmit(params){
        // 商户名，商户号拆分
        this.common.splitMerchant(params)
      },
      // 获取支付状态
      getPayStatus(){
        this.$store.dispatch("getPayStatus").then(res=>{
          this.columns[6].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.row.payStatus])
          }
          this.searchItems[5].data = res
        })
      },
      // 获取订单来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          this.columns[8].render =  (h, params) => {
            return h('span', this.common.arrayTurnObj(res)[params.row.orderSource])
          }
          this.searchItems[6].data = res
        })
      },
      // 获取支付渠道
      getChannel(){
        this.$store.dispatch("getChannel").then(res=>{
          this.searchItems[7].data = res
        })
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

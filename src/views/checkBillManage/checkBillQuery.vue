<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"
          :apiPrefix="apiPrefix"
          @beforeSubmit="beforeSubmit"
          @searchSubmit="searchSubmit"
          :hannleItems="hannleItems"></list>
<!--    <confirm ref="confirmModel"-->
<!--             :content="content"-->
<!--             :sucessMsg="sucessMsg"-->
<!--             :mode="mode"></confirm>-->
  </div>
</template>
<script>
  import list from '@/components/global/list'
  // import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        apiPrefix:this.common.config.apiReconciliation,
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '渠道名称',
            key: 'channelCode',
            render: (h, params) => {
                // return h('span', this.common.formatNumber(params.row.orderAmount))
            }
          },
          {
            title: '不平账笔数',
            key: 'failCount',
          },
          {
            title: '对账日期',
            key: 'reconDate',
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
                  auth:'checkBillDetail',
                  action: () => {
                    this.$router.push({
                        path: "/checkBillManage/checkBillDetail",
                        query: {
                            channelCode: params.row.channelCode,
                            reconDate: params.row.reconDate
                        }
                    });
                    // 新窗口打开
                    // let href = this.$router.resolve({
                    //   path: "/checkBillManage/checkBillDetail",
                    //   query: { id: params.row.id,routeType:"detail"}
                    // }).href;
                    // window.open(href, '_blank');
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          // sort:'modifyTime',
          // order:'desc'
        },
        url: '/reconStat/fail/list',
        searchItems: [
          {
            label: '起始日期',
            type: 'date',
            name: 'beginDate',
            format:'yyyy-MM-dd',
            value: new Date(new Date().getTime()-24*60*60*1000),
            options:{}
          },
          {
            label: '结束日期',
            type: 'date',
            name: 'endDate',
            format:'yyyy-MM-dd',
            value: new Date(),
            options:{}
          },
          {
            label: '支付渠道',
            type: 'select',
            name: 'channelCode',
            data: ''
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
    components: {list},
    created(){
      // 获取支付渠道
      this.getChannel()
      // 日期限制
      this.checkDate()

    },
    mounted(){
        // this.searchSubmit()
        // this.$store.dispatch('getList',this.apiPrefix)
        this.$refs.gridTable.searchSubmit()
    },
    methods: {
      // 搜索之前
      beforeSubmit(params){

      },
      searchSubmit(params){
          if(params && !params.beginDate){
              this.$Message.warning('请选择开始日期')
              return
          }else if(params && !params.endDate){
              this.$Message.warning('请选择结束日期')
              return;
          }
          this.$store.dispatch('getList',this.apiPrefix).then(res=>{
              // if(res.success){
              //     // this.$emit('afterSubmit',res)
              // }else{
              //     this.$Message.warning(res.message||'无响应')
              // }
          })
      },
      // 获取支付渠道
      getChannel(){
        this.$store.dispatch("getChannel").then(res=>{
          this.searchItems[2].data = res
            let channelListObj = {}
            res.forEach(ele=>{
                channelListObj[ele.value] = ele.label
            })
            this.columns[1].render=(h,params)=>{
              let span = h('span',channelListObj[params.row.channelCode])
              return span
            }
        })
      },
      // 日期限制
      checkDate(){
        // 开始时间结束时间限制
        let startDateItem = this.searchItems[0]
        let endDateItem = this.searchItems[1]
        if(startDateItem && endDateItem){
          startDateItem.onChange=(date1)=>{
            endDateItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2.getTime()<new Date(this.common.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }if(date2.getTime()-365*24*60*60*1000>new Date(this.common.formateDateStr(date1)).getTime()){
                    // 结束日期不得大于一年
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
              }else if(date2.getTime()+365*24*60*60*1000<new Date(this.common.formateDateStr(date1)).getTime()){
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

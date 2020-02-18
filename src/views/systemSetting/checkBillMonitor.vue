<template>
    <div>
      <h5>渠道对账监控</h5>
      <p style="margin: 5px 0">监控渠道对账</p>
      <Table border
             :columns="columns"
             :data="todayList"></Table>
<!--      历史记录弹框-->
      <Modal v-model="showModal">
        <h5>渠道对账监控</h5>
        <p>对账渠道：{{channelName}}</p>
        <p>执行时间：T+1日 凌晨 06：00</p>

        <p style="margin: 5px 0">历史对账明细</p>
        <Table border
               :columns="columns1"
               :data="res.rows"></Table>
        <Page :total="res.total"
              class-name="pages"
              @on-change="changepage2"
              @on-page-size-change="pageSizeShange"
              show-total
              show-sizer
              show-elevator
              :current="params.page"
              :page-size="params.limit"></Page>
        <div slot="footer">
          <Button @click="showModal=false">关闭</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
        name: "checkBillMonitor",
        data () {
            return {
                apiPrefix:this.common.config.apiReconciliation,
                channelName:'',
                columns: [
                    {
                        title: '支付渠道',
                        key: 'channelCode',
                        render:(h,params)=>{
                        }
                    },
                    {
                        title: '今日是否对账',
                        key: 'reconStatus',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row.reconStatus == 0){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                            },this.filter.turn('reconStatus',params.row.reconStatus))
                            return span
                        }
                    },
                    {
                        title: '对账完成时间',
                        key: 'finishTime'
                    },
                    {
                        title: '最近对账结果',
                        key: 'reconResult',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row.reconResult == 0){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                            },this.filter.turn('reconResult',params.row.reconResult))
                            return span
                        }
                    },
                ],
                todayList: [
                ],
                params:{
                    limit:10,
                    page:1,
                    channelCode:''
                },
                columns1: [
                    {
                        title: '支付渠道',
                        key: 'channelCode',
                        render:(h,params)=>{
                        }
                    },
                    {
                        title: '是否对账',
                        key: 'reconStatus',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row.reconStatus == 0){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                            },this.filter.turn('reconStatus',params.row.reconStatus))
                            return span
                        }
                    },
                    {
                        title: '对账完成时间',
                        key: 'finishTime'
                    },
                    {
                        title: '对账结果',
                        key: 'reconResult',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row.reconResult == 0){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                            },this.filter.turn('reconResult',params.row.reconResult))
                            return span
                        }
                    }
                ],
                showModal:false,
                res:{
                    rows:[],
                    total:0
                }
            }
        },
        created(){
            // 获取支付渠道
            this.getChannel()
            // 获取今日对账列表
            this.getTodayList()
        },
        methods:{
            // 获取支付渠道
            getChannel(){
                this.$store.dispatch("getChannel").then(res=>{
                    let channelListObj = {}
                    res.forEach(ele=>{
                        channelListObj[ele.value] = ele.label
                    })
                    this.columns[0].render=(h,params)=>{
                        let span = h('span',{
                            style:{
                                color:'#81b4ff',
                                cursor: 'pointer'
                            },
                            on:{
                                click:()=>{
                                    this.channelName = channelListObj[params.row.channelCode]
                                    this.showHistory(params.row.channelCode)
                                }
                            }
                        },channelListObj[params.row.channelCode])
                        return span
                    }
                    this.columns1[0].render=(h,params)=>{
                        let span = h('span',channelListObj[params.row.channelCode])
                        return span
                    }
                })
            },
            // 历史对账明细
            getHistoryList(){
                let url = '/reconStat/page'
                this.apiGet(url,this.params,this.apiPrefix).then(res=>{
                  if(res.success){
                      this.res = res.data
                  }else{
                      this.$Message.warning(res.message||'请求错误')
                  }
                })
            },
            // 今日对账
            getTodayList(){
                let url = '/reconStat/list'
                this.apiGet(url,{},this.apiPrefix).then(res=>{
                  if(res.success){
                      this.todayList = res.data
                  }else{
                      this.$Message.warning(res.message||'请求错误')
                  }
                })
            },
            pageSizeShange(limit){
                this.params.limit = limit
                this.getHistoryList()
            },
            changepage2(num) {
                this.params.page = num
                this.getHistoryList()
            },
            showHistory(channelCode){
                this.showModal = true
                this.params.channelCode = channelCode
                this.params.page = 1
                this.params.limit = 10
                this.getHistoryList()
            }
        }
    }
</script>

<style scoped>

</style>

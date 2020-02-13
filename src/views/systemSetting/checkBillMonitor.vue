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
        <p>对账渠道：微信支付</p>
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
                columns: [
                    {
                        title: '支付渠道',
                        key: 'name',
                        render:(h,params)=>{
                            return h('span',{
                                style:{
                                    color:'#81b4ff',
                                    cursor: 'pointer'
                                },
                                on:{
                                    click:()=>{
                                        this.showHistory()
                                    }
                                }
                            },params.row.name)
                        }
                    },
                    {
                        title: '今日是否对账',
                        key: 'age',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                            },params.row.name)
                            return span
                        }
                    },
                    {
                        title: '对账完成时间',
                        key: 'address'
                    },
                    {
                        title: '最近对账结果',
                        key: 'address',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                            },params.row.name)
                            return span
                        }
                    },
                ],
                todayList: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ],
                params:{
                    limit:10,
                    page:1
                },
                columns1: [
                    {
                        title: '支付渠道',
                        key: 'name',
                        render:(h,params)=>{
                            return h('span',{
                                style:{
                                    color:'#81b4ff',
                                    cursor: 'pointer'
                                },
                                on:{
                                    click:()=>{
                                        console.log(params.row)
                                    }
                                }
                            },params.row.name)
                        }
                    },
                    {
                        title: '是否对账',
                        key: 'age',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                                on:{
                                    click:()=>{
                                        this.showHistory()
                                    }
                                }
                            },params.row.name)
                            return span
                        }
                    },
                    {
                        title: '对账完成时间',
                        key: 'address'
                    },
                    {
                        title: '对账结果',
                        key: 'address',
                        render:(h,params)=>{
                            let style = {
                                color:'#0f0'
                            }
                            if(params.row){
                                style.color='#f00'
                            }
                            let span = h('span',{
                                style,
                                on:{
                                    click:()=>{
                                        this.showHistory()
                                    }
                                }
                            },params.row.name)
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
            // 获取今日对账列表
            this.getTodayList()
        },
        methods:{
            // 历史对账明细
            getHistoryList(){
                let url = '/splitStatistics/total'
                this.apiGet(url,this.params).then(res=>{

                })
            },
            // 今日对账明细
            getTodayList(){
                let url = '/splitStatistics/detail'
                this.apiGet(url).then(res=>{

                })
            },
            pageSizeShange(limit){
                this.params.limit = limit
                this.getHistoryList()
            },
            changepage2(num) {
                this.$store.state.list.params.page = num
                this.$refs.search.searchSubmit()
            },
            showHistory(){
                this.showModal = true
            }
        }
    }
</script>

<style scoped>

</style>

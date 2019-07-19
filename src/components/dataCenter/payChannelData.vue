<template>
  <div>
     <searchForm ref="search"
                :params="params"
                :url="url"
                :searchItems = "searchItems"
                 @searchSubmit="searchSubmit"
                @afterSubmit="afterSubmit"></searchForm>
    <table class="table">
      <tr>
        <th v-for="thItem in tableData.th">{{thItem.title}}</th>
      </tr>
      <template v-for="item,index in tableData.list">
        <tr v-for="sitem,sindex in item.list">
          <template v-if="sindex==0">
            <td :rowspan="item.list.length">
              {{item.title}}
            </td>
          </template>
          <td  v-for="tdItem,tdIndex in sitem.data">
            <render  v-if="tableData.th[tdIndex+1].render" :params="tdItem" :render="tableData.th[tdIndex+1].render"></render>
            <template  v-else>
              {{tdItem.title}}
            </template>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
    import searchForm from "@/components/global/searchForm";
    import myChart from "@/components/global/myChart";
    import render from "@/components/global/render";
    export default {
      components:{searchForm,myChart,render},
      data(){
          return {
            searchItems: [
              {
                label: '月份',
                type: 'month',
                name: 'date',
                format:'yyyy-MM',
                value: new Date(Date.now()-30*24*60*60*1000),
                disabledDate (date) {
                  let disabled = false
                  // 截至日期上个月天为止
                  if(date && date.valueOf() > Date.now()-30*24*60*60*1000){
                    disabled = true
                  }
                  return disabled
                },
              }
            ],
            exportItem: {
              // title: '导出',
              // type: 'success',
              // loading: false,
              // callback: () => {
              //   this.exportItem.loading = true
              //   let url = '/payorder/export';
              //   let params = this.$store.state.list.params
              //   this.common.exportData({
              //     url,
              //     params,
              //     text:'交易订单',
              //     callback:()=>{
              //       this.exportItem.loading = false
              //     }
              //   })
              // }
            },
            url:'/report/channelSumReport',
            params:{
            },
            tableData:{
              th:[{title:'支付渠道',name:'payChannelName'},
                {title:'渠道支付产品',name:'payProductName'},
                {title:'交易笔数',name:'transactionNo',render:this.formateTransactionNo},
                {title:'环比',name:'transactionNoRr',render:this.formateRate},
                {title:'交易金额',name:'amount'},
                {title:'环比',name:'amountRr',render:this.formateRate},
              ],
              list:[{
                title:'',
                list:[]
              }],
            }
          }
      },
      created(){

      },
      mounted(){
        // 执行搜索初始化，获取数据
        this.getDetail()
      },
      methods: {
        // 搜索
        searchSubmit(params){
          // 检查搜素条件
          if(this.checkSearch()){
            // 执行搜索初始化，获取数据
            this.$store.dispatch('getList').then(res=>{
              this.afterSubmit(res)
            })
          }
        },
        // 检查搜素条件
        checkSearch(){
          if(!this.params.date){
            this.$Message.info('请输入月份')
            return false
          }
          return true
        },
        // 搜索之后
        afterSubmit(res){
          if(res.status == 200){
            // 格式话图标数据
            this.formatRes(res)
          }else{
            // 清空列表数据
            this.tableData.list=[]
            this.$Message.error(res.message);
          }
        },
        // 执行初始化搜搜
        getDetail(){
          this.$refs.search.searchSubmit()
        },
        // 格式化图标数据
        formatRes(res){

          let list = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              let th = this.tableData.th.slice(1)
              let voList = ele.payChannelProductStatisticsVoList
              let sList = []
              if(voList && voList.length){
                voList.forEach(sEle=>{
                  let data = []
                  th.forEach(eleName=>{
                    data.push({
                      title:sEle[eleName.name],
                    })
                  })
                  sList.push({data})
                })
                // 合计
                sList.push({
                  data:[{
                    title:'合计'
                  },{
                    title:ele.totalTransactionNum
                  },{
                    title:''
                  },{
                    title:ele.totalTransactionMoney
                  },{
                    title:''
                  }]
                })

              }
              let item = {
                title:ele.payChannelName,
                list:sList
              }
              list.push(item)
            })
          }

         this.tableData.list = list
        },
        //  格式化环比
        formateRate (h, params){
          let dom;
          if(params.title){
              dom =[
                h('span', params.title+'%'),
                h('Icon', {
                    props:{
                        type:params.title<0?'ios-arrow-round-down':'ios-arrow-round-up',
                        color:params.title<0?'#0f0':'#f00',
                        size:'20'
                    }
                  }
                )]
          }
          return dom
        },
        // 交易笔数格式化
        formateTransactionNo(h, params){
          let value =  params.title.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
          return h('span', value);
        }
      }
    }
</script>

<style scoped>
  .chart-box {
    position: relative;
    padding: 20px 0;
    width: 90%;
    height: 500px;
    /*margin: 20px auto;*/
    border: 1px solid #ccc
  }
  .chart-search{
    position: absolute;
    right: 20px;
  }
  .table{
    width: 100%;
    border-collapse: collapse;
  }
  .table td,
  .table th{
    height: 40px;
    border: 1px solid #e5e5e5;
    text-align: center;
  }
  .table th {
    background-color: #EBEEF9;
  }
</style>

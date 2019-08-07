<template>
  <div>
    <searchForm ref="search"
                :params="params"
                :url="url"
                :searchItems = "searchItems"
                @searchSubmit="searchSubmit"></searchForm>
    <div class="chart-box">
      <searchForm class="chart-search"
                  ref="chartSearch"
                  :params="params"
                  :url="url"
                  :searchItems = "chartSearchItems"
                  @searchSubmit="searchSubmit"></searchForm>
      <myChart :options="chartOption"></myChart>
    </div>
  </div>
</template>

<script>
    import searchForm from "@/components/global/searchForm";
    import myChart from "@/components/global/myChart";

    export default {
      components:{searchForm,myChart},
      data(){
          return {
            searchItems: [
              {
                label: '商户名称',
                type: 'autoComplete',
                name: 'merchantNo',
                data:[],
                search: (value)=>{
                  this.common.searchMerchantList(value,this.searchItems[0])
                },
                value: '',
              }
            ],
            chartSearchItems: [
              {
                label: '开始日期',
                type: 'date',
                name: 'startDate',
                format:'yyyy-MM-dd',
                value:  new Date(Date.now()-7*24*60*60*1000),
                style:'width:130px',
                options:{},
                onChange(date){

                }
              },
              {
                label: '结束日期',
                type: 'date',
                name: 'endDate',
                format:'yyyy-MM-dd',
                value: new Date(Date.now()-24*60*60*1000),
                style:'width:130px',
                options:{},
                onChange(date){

                }
              },
            ],
            chartOption: {
              title: {
                text: '担保交易统计图表',
                subtext:'',
                textAlign:'center',
                left:"50%"
              },
              xAxis: {
                name:'日期',
                // type: 'category',
                // splitNumber:3,
                axisTick:{
                  alignWithLabel:true,
                },
                // interval:7,
                min:'',
                max:'',
                data: '',
              },
              yAxis: {
                name:'单位万元',
                type: 'value',
                // min:800,
                // max:1400
              },
              series: [{
                type: 'line',
                smooth: true,
                label: {
                  normal: {
                    show: true,
                    position: 'top'
                  }
                },
                data: '',
              }]
            },
            params:{},
            url:'/report/guaranteeSumReport'
          }
      },
      created(){
        // 检查搜素条件
        this.checkSearchDate()

      },
      mounted(){

      },
      methods: {
        // 检查搜索条件
        checkSearchDate(){
          let startSearchItem=this.chartSearchItems[0]
          let endSearchItem=this.chartSearchItems[1]

          startSearchItem.onChange=(date1)=>{
            endSearchItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2 && date2.valueOf() > Date.now()-24*60*60*1000){
                // 截至日期昨天为止
                disabled = true
              }else if(date2.valueOf()>new Date(date1).valueOf()+30*24*60*60*1000){
                // 查询日期不得超过30天
                disabled = true
              }else if(date2.getTime()<new Date(this.formateDateStr(date1)).getTime()){
                // 结束日期不得小于开始日期
                disabled = true
              }
              return disabled
            }
          }
          endSearchItem.onChange=(date1)=>{
            startSearchItem.options.disabledDate=date2=>{
              let disabled = false
              if(date2 && date2.valueOf() > Date.now()-24*60*60*1000){
                // 截至日期昨天为止
                disabled = true
              }else if(date2.valueOf()<new Date(date1).valueOf()-30*24*60*60*1000){
                // 查询日期不得超过30天
                disabled = true
              }else if(date2.getTime()>new Date(this.formateDateStr(date1)).getTime()){
                // 开始日期不得大于结束日期
                disabled = true
              }
              return disabled
            }
          }
          // 初始化时间限制
          startSearchItem.onChange(this.common.formatDate(startSearchItem.value,"yyyy-MM-dd"))
          endSearchItem.onChange(this.common.formatDate(endSearchItem.value,"yyyy-MM-dd"))
        },
        // 日期转为时间戳，如果不带时分秒，则存在时差
        formateDateStr(str){
          if(str.length <19){
            str += ' 00:00:00'.substring(10-str.length)
          }
          return str
        },
         // 检查搜素条件
        checkSearch(){
          if(!this.params.merchantNo){
            this.$Message.info('请输入商户号')
            return false
          }
          if(!this.params.startDate){
            this.$Message.info('请输入开始日期')
            return false
          }
           if(!this.params.endDate){
             this.$Message.info('请输入结束日期')
             return false
          }
          return true
        },
        // 自定义搜索
        searchSubmit(params){

          // 合并搜索条件
          this.params = Object.assign(this.$refs.search.searchForm,this.$refs.chartSearch.searchForm)

          // 商户名，商户号拆分
          this.common.splitMerchant(this.params)

          // 检查搜素条件
          if(this.checkSearch()){
            // 执行搜索初始化，获取数据
            this.$store.state.list.params = this.params
            this.$store.dispatch('getList').then(res=>{
              this.afterSubmit(res)
            })
          }
        },
        // 搜索之前
        beforeSubmit(params){

        },
        // 搜索之后
        afterSubmit(res){
          if(res.status == 200){
            // 格式话图标数据
            this.formatRes(res)
          }else{
            this.chartOption.series[0].data = ''
            this.$Message.error(res.message);
          }
        },
        // 格式化图标数据
        formatRes(res){
          let xAxisData = []
          let seriesData = []
          let list = res.data.data
          Object.keys(list).forEach((ele,index)=>{
            xAxisData.push(ele)
            seriesData.push(list[ele])
          })
          // 设置x轴
          this.chartOption.xAxis.data = xAxisData
          this.min = xAxisData[0]
          this.max = xAxisData[xAxisData.length-1]
          // 设置数据
          this.chartOption.series[0].data = seriesData
          // 设置副标题
           this.chartOption.title.subtext = `${res.data.merchantName} ${res.data.merchantNo}`
        },
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
    z-index:10;
  }
</style>

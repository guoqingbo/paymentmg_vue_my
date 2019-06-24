<template>
  <div>
    <searchForm ref="search"
                :params="params"
                :url="url"
                :searchItems = "searchItems"
                @afterSubmit="afterSubmit"></searchForm>
    <div class="chart-box">
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
                label: '开始日期',
                type: 'date',
                name: 'startDate',
                format:'yyyy-MM-dd',
                value:  new Date(Date.now()-30*24*60*60*1000),
                disabledDate (date) {
                  let disabled = false
                  // let endDate = this.$refs.searchForm.searchForm.endDate
                  // 截至日期昨天为止
                  if(date && date.valueOf() > Date.now()-24*60*60*1000){
                    disabled = true
                  }
                  return disabled
                },
                onChange(date){

                }
              },
              {
                label: '结束日期',
                type: 'date',
                name: 'endDate',
                format:'yyyy-MM-dd',
                value: new Date(Date.now()-24*60*60*1000),
                disabledDate (date) {
                  let disabled = false
                  // let endDate = this.$refs.searchForm.searchForm.endDate
                  // 截至日期昨天为止
                  if(date && date.valueOf() > Date.now()-24*60*60*1000){
                    disabled = true
                  }
                  return disabled
                },
                onChange(date){

                }
              },
            ],
            chartOption: {
              title: {
                text: '平台交易统计图表',
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
            url:'/report/platformSumReport'
          }
      },
      created(){
        // 检查搜素日期条件
        this.checkSearchDate()

      },
      mounted(){
        // 执行搜索初始化，获取数据
        this.getDetail()
      },
      methods: {
        // 检查搜索日期条件
        checkSearchDate(){
          let startSearchItem=this.searchItems[0]
          let endSearchItem=this.searchItems[1]

          startSearchItem.onChange=(date1)=>{
            endSearchItem.disabledDate=date2=>{
              let disabled = false
              if(date2 && date2.valueOf() > Date.now()-24*60*60*1000){
                // 截至日期昨天为止
                disabled = true
              }else if(date2.valueOf()>new Date(date1).valueOf()+30*24*60*60*1000){
                // 查询日期不得超过30天
                disabled = true
              }
              return disabled
            }
          }
          endSearchItem.onChange=(date1)=>{
            startSearchItem.disabledDate=date2=>{
              let disabled = false
              if(date2 && date2.valueOf() > Date.now()-24*60*60*1000){
                // 截至日期昨天为止
                disabled = true
              }else if(date2.valueOf()<new Date(date1).valueOf()-30*24*60*60*1000){
                // 查询日期不得超过30天
                disabled = true
              }
              return disabled
            }
          }
        },
        // 搜索之后
        afterSubmit(res){
          let {startDate,endDate} = this.$refs.search.searchForm
          this.chartOption.title.subtext = `统计日期 ${startDate}至${endDate}`
          if(res && res.status == 200){
            // 格式话图标数据
            this.formatRes(res)
          }else{
            this.$Message.error(res && res.message?res.message:'数据不存在');           
          }
        },
        // 执行初始化搜搜
        getDetail(){
          this.$refs.search.searchSubmit()
        },
        // 格式化图标数据
        formatRes(res){
          let xAxisData = []
          let seriesData = []
          if(res.status == 200){
            Object.keys(res.data).forEach((ele)=>{
                        xAxisData.push(ele)
                        seriesData.push(res.data[ele])
            })
          }
          // 设置x轴
          this.chartOption.xAxis.data = xAxisData
          this.min = xAxisData[0]
          this.max = xAxisData[xAxisData.length-1]
          // 设置数据
          this.chartOption.series[0].data = seriesData
        }
      }
    }
</script>

<style scoped>
  .chart-box {
    padding: 20px 0;
    width: 90%;
    height: 500px;
    /*margin: 20px auto;*/
    border: 1px solid #CCC
  }
</style>

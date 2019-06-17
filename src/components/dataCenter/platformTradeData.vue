<template>
  <div>
    <searchForm :searchItems = "searchItems"></searchForm>
    <div class="chart-box">
      <myChart :options="chartOption"></myChart>
    </div>
  </div>
</template>

<script>
    import searchForm from "@/components/global/searchForm";
    import myChart from "@/components/global/myChart";
    export default {
        name: "platformTradeData",
      components:{searchForm,myChart},
      data(){
          return {
            searchItems: [
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
            chartOption: {
              title: {
                text: '平台交易统计图表',
                subtext:'统计日期 2019-06-01至2019-06-06',
                textAlign:'center',
                left:"50%"
              },
              xAxis: {
                name:'日期',
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
                data: [820, 932, 901, 934, 1290, 1330, 1320],
              }]
          },
          }
      },
      created(){

      },
      mounted(){

      },
      methods: {

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

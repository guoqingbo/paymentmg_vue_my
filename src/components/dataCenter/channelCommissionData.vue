<template>
  <div>
    <Row>
      <Col span="16">
        <div class="chart-box">
          <myChart :options="chartOption"></myChart>
        </div>
      </Col>
      <Col span="7" offset="1">
        <Table
          border
          :columns="tableColumns"
          :data="tableData"></Table>
      </Col>
    </Row>
  </div>
</template>

<script>
    import myChart from "@/components/global/myChart";
    export default {
      components:{myChart},
      data(){
          return {
            chartOption: {
              title: {
                text: '最近6个月的佣金统计报表',
                subtext:'',
                textAlign:'center',
                left:"50%"
              },
              xAxis: {
                name:'月份',
                type: 'category',
                data: [],
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
                data: [],
              }]
          },
            tableColumns: [
              {
                title: '月份',
                key:'month',
              },
              {
                title: '交易金额（万元）',
                key: 'tradeMoney',
                render: (h, params) => {
                  return h('span', this.common.formatNumber(params.row.tradeMoney))
                }
              },
              {
                title: '环比',
                key: 'tradeQoq',
                render: this.formateRate
              }
            ],
            tableData:[]
          }
      },
      created(){
        // 获取图表数据
        this.getDetail()
      },
      mounted(){

      },
      methods: {
        // 获取图表数据
        getDetail(){
          let url = '/report/commissionSumReport';
          let params = {
              startDate:this.common.formatDate(Date.now()-6*30*24*60*60*1000,"yyyy-MM"),
              endDate:this.common.formatDate(Date.now()-30*24*60*60*1000,"yyyy-MM"),
          }

          this.apiGet(url,params).then(res=>{
             if(res.status == 200){
                // 格式话图标数据
                this.formatRes(res)
              }else{
                this.$Message.error(res.message);
              }
          })
        },
         // 格式化图标数据
        formatRes(res){
          let xAxisData = []
          let seriesData = []
          if(res.status == 200){
            res.data.forEach((ele)=>{
              xAxisData.push(ele.month)
              seriesData.push(ele.tradeMoney)
            })
          }
          // 设置x轴
          this.chartOption.xAxis.data = xAxisData
          this.min = xAxisData[0]
          this.max = xAxisData[xAxisData.length-1]
          // 设置数据
          this.chartOption.series[0].data = seriesData

          // 表格数据
          this.tableData = res.data
        },
        //  格式化环比
        formateRate (h, params){
          let dom;
          let value = params.row[params.column.key]
          if(value){
              dom =[
                h('span', value+'%'),
                h('Icon', {
                    props:{
                        type:value<0?'ios-arrow-round-down':'ios-arrow-round-up',
                        color:value<0?'#0f0':'#f00',
                        size:'20'
                    }
                  }
                )]
          }
          return dom
        }
      }
    }
</script>

<style scoped>
  .chart-box {
    padding: 20px 0;
    width: 100%;
    height: 500px;
    /*margin: 20px auto;*/
    border: 1px solid #CCC
  }
  .order-source{
    padding-bottom: 20px;
  }
</style>

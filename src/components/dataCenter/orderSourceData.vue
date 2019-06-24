<template>
  <div>
    <div class="order-source">
      <Button  v-for='item,index in orderSource' 
               :key="index" 
               :type='orderIndex==index?"info":"default"' 
               @click="changeOrderSource(index)">{{item.label}}</Button>
    </div>
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
            orderSource:[],
            orderIndex:0,
            chartOption: {
              title: {
                text: '最近6个月交易统计',
                subtext:'',
                textAlign:'center',
                left:"50%"
              },
              xAxis: {
                name:'日期',
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
                key:'statisticMonth',
              },
              {
                title: '交易金额（万元）',
                key: 'tradeMoney',
              },
              {
                title: '环比',
                key: 'tradeMoneyQoq',
                render: this.formateRate
              }
            ],
            tableData:[]
          }
      },
      created(){
          // 获取订单来源
          this.getMerchantSource()
          
      },
      mounted(){
         
      },
      methods: {
        // 获取订单来源
        getMerchantSource(){
          this.$store.dispatch("getMerchantSource").then(res=>{
            this.orderSource = res
            // 按订单来源统计
            this.orderSourceReport()
          })
        },
        // 切换订单来源
        changeOrderSource(index){
          this.orderIndex = index
          // 按订单来源统计
          this.orderSourceReport()
        },
        // 按订单来源统计
        orderSourceReport(){
          let url = '/report/orderSrcSumReport';
          let params = {
              startDate:this.common.formatDate(Date.now()-6*30*24*60*60*1000,"yyyy-MM"),
              endDate:this.common.formatDate(Date.now()-30*24*60*60*1000,"yyyy-MM"),
              src:this.orderSource[this.orderIndex].value
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
              xAxisData.push(ele.statisticMonth)
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
                h('span', value*100+'%'),
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

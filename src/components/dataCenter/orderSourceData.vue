<template>
  <div>
    <div class="order-source">
      <Button v-for='item,index in orderSource'>{{item.label}}</Button>
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
            tableColumns: [
              {
                title: '月份',
                key:'mouth',
              },
              {
                title: '交易金额（万元）',
                key: 'tradeMoney',
              },
              {
                title: '环比',
                key: 'rate',
                render: (h, params) => {
                  return h('span', '12')
                }
              }
            ],
            tableData:[{
              mouth:'12',
              tradeMoney:'888',
              rate:'45'
            }]
          }
      },
      created(){
          this.getMerchantSource()
      },
      mounted(){

      },
      methods: {
        // 获取订单来源
        getMerchantSource(){
          this.$store.dispatch("getMerchantSource").then(res=>{
            this.orderSource = res
          })
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

<template>
  <div id="myChart" ref="myChart" style="width: 100%;height: 100%"></div>
</template>

<script>
  // import echarts  from 'echarts'
  // import echarts from 'vue-echarts/components/ECharts'
  // // 加载echarts，注意引入文件的路径
  import echarts from 'echarts/lib/echarts'
  // // 再引入你需要使用的图表类型，标题，提示信息等
  import 'echarts/lib/chart/line'
  // import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
    export default {
    data(){
      return{
        chart:''
      }
    },
      props:["options"],
      mounted(){

      },
      created(){
        // 不使用$nextTick的话，刷新时，图表的宽度不对
        this.$nextTick(() => {
          this.draw()
        });
        window.onresize = () => {
          //  根据窗口大小调整曲线大小
          this.chart && this.chart.resize()
        }
      },
      watch: {
        options: {
          handler(newValue, oldValue) {
            // 绘制条形图
            if(this.chart){
              this.chart.clear()
              this.chart.setOption(this.options)
            }
          },
          deep: true,
          // immediate: true
        }
      },
      methods: {
        draw() {
          // 实例化echarts对象
          let myChart = echarts.init(this.$refs.myChart)
          // 绘制条形图
          myChart.setOption(this.options)
          this.chart = myChart
        }
      },
      activated () {
        this.chart && this.chart.resize()
      },
    }
</script>

<style scoped>

</style>

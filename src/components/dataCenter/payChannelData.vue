<template>
  <div>
    <searchForm :searchItems = "searchItems" :exportItem="exportItem"></searchForm>
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
          <td  v-for="tdItem in sitem.list">{{tdItem}}</td>
        </tr>
      </template>
    </table>
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
                label: '商户号',
                type: 'input',
                name: 'merchantNo',
                value: '',
              }
            ],
            exportItem: {
              title: '导出',
              type: 'success',
              loading: false,
              callback: () => {
                this.exportItem.loading = true
                let url = '/payorder/export';
                let params = this.$store.state.list.params
                this.common.exportData({
                  url,
                  params,
                  text:'交易订单',
                  callback:()=>{
                    this.exportItem.loading = false
                  }
                })
              }
            },
            tableData:{
              th:[{title:'支付渠道'},
                {title:'渠道支付产品'},
                {title:'交易笔数'},
                {title:'环比'},
                {title:'交易金额'},
                {title:'环比'},
              ],
              list:[{
                title:'易宝支付',
                list:[{
                  list:['支付宝扫码支付1', '18000', '18000', '18000', '18000']
                },{
                  list:['支付宝扫码支付2', '18000', '18000', '18000', '18000']
                },{
                  list:['合计', '18000', '18000', '18000', '18000']
                }]
              },{
                title:'易宝支付2',
                list:[{
                  list:['支付宝扫码支付2', '18000', '18000', '18000', '18000']
                },{
                  list:['支付宝扫码支付2', '18000', '18000', '18000', '18000']
                },{
                  list:['合计', '18000', '18000', '18000', '18000']
                }]
              }],
            }
          }
      },
      created(){

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

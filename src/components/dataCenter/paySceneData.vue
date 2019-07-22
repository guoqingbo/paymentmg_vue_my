<template>
  <div>
    <searchForm ref="search"
                :params="params"
                :url="url"
                :searchItems = "searchItems"
                @searchSubmit="searchSubmit"></searchForm>
    <table class="table">
      <tr>
        <th v-for="thItem in tableData.th">{{thItem.title}}</th>
      </tr>
      <template v-for="item,index in tableData.list">
        <template v-for="sitem,sindex in item.list">
          <tr v-for="sitem1,sindex1 in sitem.list">
            <template v-if="sindex==0 && sindex1==0">
              <td :rowspan="item.rowspan">
                <div>{{item.title}}</div>
                <div>({{item.titleNo}})</div>
              </td>
            </template>
            <template v-if="sindex1==0">
              <td :rowspan="sitem.list.length" :class="{background:sitem.title=='合计'}">
                {{sitem.title}}
              </td>
            </template>
            <td v-for="tdItem in sitem1.list" :class="{background:sitem.title=='合计'}">{{tdItem}}</td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script>
  import searchForm from "@/components/global/searchForm";
  import myChart from "@/components/global/myChart";

  export default {
    components: {searchForm, myChart},
    data() {
      return {
        params:{},
        url:'/report/sceneSumReport',
        searchItems: [
          {
            label: '日期',
            type: 'date',
            name: 'date',
            format:'yyyy-MM-dd',
            value: new Date(Date.now()-24*60*60*1000),
            options:{
              disabledDate (date) {
                let disabled = false
                // 截至日期昨天为止
                if(date && date.valueOf() > Date.now()-24*60*60*1000){
                  disabled = true
                }
                return disabled
              }
            },
          },
          {
            label: '商户号',
            name: 'merchantNo',
            value: '',
            type: 'autoComplete',
            data:[],
            search: (value)=>{
              this.searchMerchantList(value,1)
            }
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
          //     text: '交易订单',
          //     callback: () => {
          //       this.exportItem.loading = false
          //     }
          //   })
          // }
        },
        tableData: {
          th: [{title: '商户名称'},
            {title: '支付场景'},
            {title: '渠道支付产品'},
            {title: '交易笔数',render:this.formateTransactionNo},
            {title: '交易金额'},
          ],
          list: [
            {
              rowspan: '',
              title: '',
              list: [
                // {
                //   title: '易拉宝123',
                //   list: [
                //     {list: ['支付宝扫码支付1', '18000', '18000']}
                //   ]
                // }
              ]
            },
          ],
        }
      }
    },
    computed: {},
    created() {

    },
    methods: {
        // 检查搜素条件
        checkSearch(){

          if(!this.params.date){
            this.$Message.info('请输入日期')
            return false
          }
          if(!this.params.merchantNo){
            this.$Message.info('请输入商户号')
            return false
          }
          return true
        },
        // 自定义搜索
        searchSubmit(params){
          // 搜索条件
          this.params = params

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
            this.tableData.list = []
            this.$Message.error(res.message);
          }
        },
        // 格式化图标数据
        formatRes(res){
          let tempList = {}
          let list = []
          let rows = []
          if(res.data && res.data.parentChannelPayProductsVoList){
            rows = rows.concat(res.data.parentChannelPayProductsVoList)
          }
          if(res.data && res.data.subChannelPayProductsVoList){
            rows = rows.concat(res.data.subChannelPayProductsVoList)
          }
          rows.forEach(ele=>{
             // 商户名存在
            let ssItem = [ele.channelPayProductName,ele.tradeNum,ele.tradeMoneyAmount]
            if(tempList[ele.merchantName]){
              // 判断是否合并的临时数据
              let merchantTmp = tempList[ele.merchantName]
              let sceneTmp = tempList[ele.merchantName].list[ele.sceneName]

              let item = list[merchantTmp.index]
              item.rowspan++
              if(sceneTmp){
                // 支付场景存在
                item.list[sceneTmp.index].list.push({list:ssItem})
              }else{
                tempList[ele.merchantName].list[ele.sceneName] = {index:item.list.length-1}
                item.list =  [{
                  title:ele.sceneName,
                  list:[
                    {list:ssItem}
                  ]
                }]
              }

            }else{
              let item = {
                title:ele.merchantName,
                titleNo:ele.merchantCode,
                rowspan:1,
                list:[
                  {
                    title:ele.sceneName,
                    list:[
                      {
                        list:ssItem
                      }
                    ]
                  }
                ]
              }
              list.push(item)

              // 用于判断是否合并
              tempList[ele.merchantName] = {index:list.length-1,list:{}}
              tempList[ele.merchantName].list[ele.sceneName] = {index:item.list.length-1}
            }
          })
          // 插入合计
          this.addTotalTr(list)
          this.tableData.list = list
        },
        addTotalTr(list){

            list.forEach(ele=>{
              let tradeNum = 0
              let tradeMoneyAmount = 0
              ele.list.forEach(sele=>{
                sele.list.forEach(ssele=>{
                  tradeNum+=Number(ssele.list[1])
                  tradeMoneyAmount+=Number(ssele.list[2])
                })
              })
              ele.rowspan++
              ele.list.push({
                title:'合计',
                list:[{list:["",tradeNum,tradeMoneyAmount]}]
              })
            })
        },
        // 商户信息模糊查询
        searchMerchantList(keyword,columnType){
          // columnType，1:code查询，2:name查询
          if(keyword && columnType){
            let params = {
              vagueMerchantMark:keyword,
              columnType,
            }
            let url = '/merchant/queryMerchantListByVagueMerchantMark'
            this.apiGet(url,params).then(res=>{
              if(res.status == 200){
                let data = []
                if(res.data.length){
                  res.data.forEach(ele=>{
                    if(columnType == 1){
                      // 1:code查询
                      data.push({label:ele.merchantCode,value:ele.merchantCode})
                    }else{
                      // 2:name查询
                      data.push({label:ele.merchantName,value:ele.merchantName})
                    }

                  })
                }else{
                  data = [{label:'暂无数据',value:''}]
                }
                if(columnType == 1){
                  this.searchItems[1].data = data
                }else{
                  this.searchItems[0].data = data
                }
              }
            })
          }
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

  .chart-search {
    position: absolute;
    right: 20px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table td,
  .table th {
    height: 40px;
    border: 1px solid #e5e5e5;
    text-align: center;
  }

  .table th {
    background-color: #EBEEF9;
  }
  .background{
     background-color: #EBEEF9;
  }
</style>

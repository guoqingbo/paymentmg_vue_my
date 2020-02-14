<template>
  <div>
    <div>
      <Form ref="formInline"
            :model="searchForm"
            inline>
        <FormItem>
          <DatePicker type='month'
                      placeholder="请输入日期"
                      v-model="searchForm.date"
                      format="yyyy-MM"></DatePicker>
        </FormItem>
        <FormItem>
          <AutoComplete class="my-autoComplete"
                        v-model="searchForm.merchantNo"
                        @on-search="merchantSearch"
                        icon="ios-search"
                        clearable
                        placeholder="请输入商户简称">
            <Option v-for="(sitem,sindex) in autoComplete.data"
                    :value="sitem.value"
                    :key="sindex">{{ sitem.label }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search" @click="searchSubmit()">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="calender">
      <div style="text-align: center;padding-bottom: 10px;font-size: 14px">{{nowLi}}</div>
      <div class="date_wrap">
        <ul class="day">
          <li v-for="(item,index) in 12"
              :key=index
              :class="{now:month == item,flag:Object.keys(dayListObj).length && !dayListObj[item]}">
            <p style="text-align: right;padding: 5px 10px">
              {{item+'月'}}
            </p>
            <div style="padding: 0 10px" v-if="Object.keys(dayListObj).length">
              <Icon type="md-arrow-down"
                    v-if="dayListObj[item]"
                    @click="downLoad(item)"/>
              <span v-else>账单未出</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                apiPrefix:this.common.config.apiReconciliation,
                dayListObj:{},
                // year:'',
                month:'',
                nowLi:'',
                // 搜索
                searchForm:{
                    date:new Date(),
                    merchantNo:''
                },
                autoComplete:{data:[]}
            }
        },
        methods:{
            merchantSearch(keyword){
                this.common.searchMerchantList(keyword,this.autoComplete)
            },
            searchSubmit(){
                // 创建日历
                let {merchantNo,date} = this.searchForm
                if(!merchantNo){
                    this.$Message.warning('请选择商户简称')
                    return
                }else if(!date){
                    this.$Message.warning('请选时间')
                    return
                }
                let yearDate = this.common.formatDate(date, "yyyy")
                let merchantNoObj = merchantNo.match(/\((.+?)\)/);
                let url = '/reconStat/month/list'
                let params = {
                    yearDate,
                    merchantNo:merchantNoObj[1]
                }
                this.apiGet(url,params,this.apiPrefix).then(res=>{
                    if(res.success){
                        let dayListObj= {}
                        res.data.forEach(ele=>{
                            let reconDate = Number(ele.reconDate)
                            console.log(reconDate)
                            dayListObj[reconDate] = ele.flag
                        })
                        this.dayListObj = dayListObj
                    }else{
                        this.$Message.warning(res.message||'请求错误')
                    }
                })

            },
            downLoad(month){
                let url='/reconStat/month/download'
                let {merchantNo,date} = this.searchForm
                if(month<10){
                    month = '0'+month
                }
                let monthDate = this.common.formatDate(date, "yyyy")+'-'+month
                let merchantNoObj = merchantNo.match(/\((.+?)\)/);
                let params = {
                    monthDate,
                    merchantNo:merchantNoObj[1]
                }
                this.apiGetBlob(url,params,this.apiPrefix).then(res=>{
                    if(res){
                        let url = window.URL.createObjectURL(res)
                        let a = document.createElement('a')
                        a.href = url
                        a.download = '对账单'+monthDate+'.cvs'
                        document.body.appendChild(a)
                        a.click()
                        a.parentNode.removeChild(a);
                    }else {
                        this.$Message.error('报表没有记录')
                    }
                })
            },
        },
        created(){
            // this.searchSubmit()
        }
    }
</script>
<style scoped>
  .calender{
    width: 100%;
    position: relative;
  }
  .date_wrap{
    position: relative;
  }
  .day{
    display: flex;
    flex-direction: row;
    /*padding: 20px;*/
    font-size: 14px;
    flex-wrap: wrap;
    border-bottom: 1px solid #ccc;
  }
  .day li{
    width: 16.6666%;
    /*padding: 20px;*/
    box-sizing: border-box;
    border-left: 1px solid #ddd;
    border-top:1px solid #ddd;
    height: 60px;
    /*background-color: rgba(217,217,217,.5);*/
  }
  .day li:nth-child(6n){
    border-right: 1px solid #ddd
  }
  .day li.flag{
    background-color: #c5c8ce;
  }
  .now{
    background: #f2f8fe;
    color:#1989fa;
  }


  .my-autoComplete .ivu-select-dropdown-list{
    max-height: 280px;
    overflow: auto;
    width: 180px;
  }

</style>

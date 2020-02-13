<template>
  <div>
    <Form ref="formInline"
          :model="searchForm"
          inline>
      <FormItem>
        <DatePicker type='date'
                    placeholder="请输入日期"
                    v-model="searchForm.date"
                    format="yyyy-MM-dd"></DatePicker>
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
    <div class="calender">
      <div style="text-align: center;padding-bottom: 10px;font-size: 14px;margin-top: -10px">{{nowLi}}</div>
      <div class="date_wrap">
        <ul class="week">
          <li v-for="(item,index) in weekList" :key="index">{{item}}</li>
        </ul>
        <ul class="day">
          <li v-for="(item,index) in days"
              :key=index
              :class="{now:item.date && nowLi==item.date,nowmonth:item.date && month == item.date.split('-')[1]}">
            <p class="day-value">
              {{item.day}}
            </p>
            <div style="padding: 0 10px" v-if="item.date && month == item.date.split('-')[1]">
              <Icon type="md-arrow-down" />
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
                weekList:['周日','周一','周二','周三','周四','周五','周六'],
                year:'',
                month:'',
                days:[],
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
            //控制当前日期显示特殊样式
            handleShowDateStyle(){
                this.nowLi = this.common.formatDate(this.searchForm.date, "yyyy-MM-dd")
                console.log(this.nowLi)
            },
            //得到当前年这个月分有多少天
            getDays(Y,M){
                let day = new Date(Y, M, 0).getDate()
                return day;
            },
            //得到当前年，这个月的一号是周几
            getWeek(Y,M){
                let now = new Date()
                now.setFullYear(this.year)
                now.setMonth(this.month-1)
                now.setDate(1);
                let week = now.getDay();
                return week;
            },
            pushDays(){
                //将这个月多少天加入数组days
                for(let i = 1; i<=this.getDays(this.year,this.month);i++){
                    let date = this.formatDate(this.year,this.month,i)
                    let day = this.month+'月'+i+'日'
                    this.days.push({day,date})
                }
                //将下个月要显示的天数加入days
                for(let i = 1;i<=42-this.getDays(this.year,this.month)-this.getWeek(this.year,this.month);i++){
                    this.days.push({day:i})
                }
                //将上个月要显示的天数加入days
                for(let i=0;i<this.getWeek(this.year,this.month);i++){
                    var lastMonthDays=this.getDays(this.year,this.month-1)
                    this.days.unshift({day:lastMonthDays-i})
                }
            },
            formatDate(year,month,day){
                if(month<10){
                    month='0'+month
                }
                if(day<10){
                    day='0'+day
                }
                return year+'-'+month+'-'+day
            },
            getDate(){
                this.days = []
                let now = this.searchForm.date || new Date();
                this.year = now.getFullYear();
                this.month = now.getMonth()+1;
                this.pushDays();

            },
            changeDate(){

            },
            handleShowNextMonth(){
                this.days=[];
                if(this.month<12){
                    this.month=this.month+1;
                    this.pushDays();
                }else{
                    this.month= this.month=1;
                    this.year=this.year+1;
                    this.pushDays();
                }

            },
            handleShowToday(){
                this.days=[];
                let now = new Date();
                this.year=now.getFullYear();
                this.month=now.getMonth()+1;
                this.pushDays();
            },
            handleShowLastMonth(){
                this.days=[];
                if(this.month>1){
                    this.month=this.month-1;
                    this.pushDays();
                }else if( this.year>1970){
                    this.month=12;
                    this.year=this.year-1;
                    this.pushDays();
                }else{
                    alert("不能查找更远的日期")
                }

            },
            //
            merchantSearch(keyword){
                this.common.searchMerchantList(keyword,this.autoComplete)
            },
            searchSubmit(){

                let date = this.common.formatDate(this.searchForm.date, "yyyy-MM-dd")

                this.getDate();
                this.handleShowDateStyle();
            }
        },
        created(){
            this.searchSubmit()
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
  .week{
    display: flex;
    flex-direction: row;
    font-size: 14px;
    text-align: center;
    border-top: 1px solid #ddd;
    border-left:1px solid #ddd;
    /*padding: 10px 0;*/
    height: 40px;
    line-height: 40px;
    background-color: #57a3f3;
  }
  .week li{
    width: 14.28%;
    border-right: 1px solid #ddd;
  }
  .day{
    display: flex;
    flex-direction: row;
    /*padding: 20px;*/
    font-size: 12px;
    flex-wrap: wrap;
  }
  .day li{
    width: 14.28%;
    /*padding: 20px;*/
    box-sizing: border-box;
    border: 1px solid #ddd;
    height: 60px;
    background-color: rgba(217,217,217,.5);
  }
  .day li.nowmonth{
    background-color: #fff;
  }
  .day li .day-value{
    padding: 5px 10px;
    text-align: right;
  }
  .day li:nth-child(n+8){
    border-top:none;
  }
  .day li:nth-child(n+1){
    border-right: none;
  }
  .day li:nth-child(7n){
    border-right: 1px solid #ddd
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

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
              :class="{now:month == item}">
            <p style="text-align: right;padding: 5px 10px">
              {{item+'月'}}
            </p>
            <div style="padding: 0 10px">
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
                year:'',
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
                let date = this.common.formatDate(this.searchForm.date, "yyyy-MM")
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

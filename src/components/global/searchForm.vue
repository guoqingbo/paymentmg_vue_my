<template>
  <Form ref="formInline"
        :model="searchForm"
        inline
        v-if="searchItems && searchItems.length">
    <FormItem v-for="item in searchItems" :key="item.label">
      <Input v-if="item.type=='input'"
             clearable
             v-model="item.value"
             :placeholder="'请输入'+item.label"
             :style="item.style"></Input>
      <AutoComplete class="my-autoComplete"
                    :disabled="item.disabled"
                    v-if="item.type=='autoComplete'"
                    v-model="item.value"
                    @on-search="item.search?item.search($event):''"
                    icon="ios-search"
                    clearable
                    :placeholder="'请输入'+item.label">
        <Option v-for="(sitem,sindex) in item.data" :value="sitem.value" :key="sindex">{{ sitem.label }}</Option>
      </AutoComplete>
      <DatePicker v-if="item.type=='date' || item.type=='month'"
                  @on-change="item.onChange?item.onChange($event):''"
                  :type='item.type'
                  :placeholder="'请输入'+item.label"
                  v-model="item.value"
                  :options="item.options"
                  :format="item.format||'yyyy-MM-dd'"
                  :style="item.style"></DatePicker>
      <Select v-if="item.type=='select'"
              clearable
              v-model="item.value"
              :placeholder="'请选择'+item.label"
              :style="item.style">
        <Option v-for="sitem in item.data"
                :value="sitem.value"
                :key="sitem.value">{{ sitem.label }}</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button type="primary" icon="ios-search" @click="searchSubmit(1)">搜索</Button>
    </FormItem>
    <FormItem v-if="exportItem">
      <Button type="primary"
              :icon="exportItem.icon"
              @click="exportItem.callback"
              :loading="exportItem.loading">{{ exportItem.title }}</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  data () {
    return {
      searchForm: {},
      autoSelected: false,
    }
  },
  props: ['searchItems','exportItem','url','params','apiPrefix'],
  watch: {
    searchItems: {
      handler(newValue, oldValue) {
        if(newValue instanceof Array){
          let startDateItem = ''
          let endDateItem = ''
          newValue.forEach((element,index) => {
            if(typeof element.value == 'undefined'){
              // 作用是监听输入框value的变化
              this.$set(element, 'value','')
            }
            if(typeof element.options == 'undefined'){
              // 作用是监听options的变化，使表单验证起作用
              this.$set(element, 'options',{})
            }
            if(element.name){
              // 格式化日期
              if(element.value instanceof Date){
                element.value = this.common.formatDate(element.value, element.format||"yyyy-MM-dd")
              }
              // if(element.type == 'autoComplete'){
              //   return
              // }
              // if(element.name == 'startDate' ||
              //   element.name == 'orderTimeStart' ||
              //   element.name == 'date'){
              //   startDateItem = element
              //   // 初始化时间限制
              //   // onChange1是添加的中间函数
              //   if(!element.onChange1){
              //     element.options.disabledDate = element.disabledDate
              //   }
              // }
              // if(element.name == 'endDate' ||  element.name == 'orderTimeEnd'){
              //   endDateItem = element
              //   // 初始化时间限制
              //   if(!element.onChange1){
              //     element.options.disabledDate = element.disabledDate
              //   }
              // }
              let val = element.value
              if(val && typeof val == 'string'){
                val = val.replace(/(^\s*)|(\s*$)/g, "")
              }
              this.$set(this.searchForm, element.name, val)
            }
          })

          // // 开始时间结束时间限制
          // if(startDateItem && endDateItem){
          //   startDateItem.onChange1=(date1)=>{
          //     // console.log(this.$refs.search.searchForm)
          //     if(startDateItem.onChange){
          //       startDateItem.onChange(date1)
          //     }
          //     endDateItem.options.disabledDate=date2=>{
          //       let disabled = false
          //       if(endDateItem.disabledDate){
          //         disabled = endDateItem.disabledDate(date2)
          //       }
          //       if(date2.getTime()<new Date(this.formateDateStr(date1)).getTime()){
          //         // 结束日期不得小于开始日期
          //         disabled = true
          //       }
          //       return disabled
          //     }
          //   }
          //   endDateItem.onChange1=(date1)=>{
          //     // console.log(this.$refs.search.searchForm)
          //     if(endDateItem.onChange){
          //       endDateItem.onChange(date1)
          //     }
          //     startDateItem.options.disabledDate=date2=>{
          //       let disabled = false
          //       if(startDateItem.disabledDate){
          //         disabled = startDateItem.disabledDate(date2)
          //       }
          //       if(date2.getTime()>new Date(this.formateDateStr(date1)).getTime()){
          //         // 开始日期不得大于结束日期
          //         disabled = true
          //       }
          //       return disabled
          //     }
          //   }
          // }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {

  },
  created(){

  },
  methods: {
    // autoChange(val,item) {
    //   if(this.autoSelected){ // 判断是否是自动填充
    //     this.autoSelected = false;
    //     if(this.searchForm.merchantCode!=undefined){
    //       this.searchItems.forEach(ele=>{
    //         if(ele.name=='merchantCode'){
    //           ele.value = item.code;
    //         }
    //       });
    //       this.$set(this.searchForm, "merchantName", item.keyword);
    //     }
    //     if(this.searchForm.merchantNo!=undefined){
    //       this.searchItems.forEach(ele=>{
    //         if(ele.name=='merchantNo'){
    //           ele.value = item.code;
    //         }
    //       });
    //       this.$set(this.searchForm, "merchantNa", item.keyword);
    //     }
    //   }else{
    //     if(this.searchForm.merchantCode!=undefined){
    //       this.searchItems.forEach(ele=>{
    //         if(ele.name=='merchantCode'){
    //           ele.value = '';
    //         }
    //       });
    //       this.$set(this.searchForm, "merchantName", item.value);
    //     }
    //     if(this.searchForm.merchantNo!=undefined){
    //       this.searchItems.forEach(ele=>{
    //         if(ele.name=='merchantNo'){
    //           ele.value = '';
    //         }
    //       });
    //       this.$set(this.searchForm, "merchantNa", item.value);
    //     }
    //   }
    // },
    // autoSelect(val,item) {
    //   this.autoSelected = true;
    //   let newValue = val.match(/\(.+\)/g);
    //   if(newValue instanceof Array) {
    //     item.code = newValue[0];
    //     item.keyword = val.replace(/\(.+\)/g,'');
    //   }
    //   item.code = item.code.replace(/\(|\)/g,'');
    // },
    searchSubmit (page) {
      if(page){
        this.$store.state.list.params.page = page
      }
      // 格式化日期
      this.formateDate()
      this.$store.state.list.url = this.url;
      this.$store.state.list.params = this.params
      this.$store.state.list.params = Object.assign(
        this.params,
        this.searchForm
      );
      // 是否自定义搜索
      if (this._events.searchSubmit) {
        this.$emit("searchSubmit",this.$store.state.list.params)
        return
      }
     // 搜索前
      this.$emit('beforeSubmit',this.$store.state.list.params)
      this.$store.dispatch('getList',this.apiPrefix).then(res=>{
        if(res.success){
          this.$emit('afterSubmit',res)
        }else{
          this.$Message.warning(res.message||'无响应')
        }
      })
    },
    formateDate(){
      // 格式化日期
      // this.searchForm.startDate += ' 00:00:00'
      // this.searchForm.endDate += ' 23:59:59'
      if(this.searchItems instanceof Array){
        this.searchItems.forEach(ele=>{
          if(this.searchForm[ele.name] instanceof Date){
            this.searchForm[ele.name] = this.common.formatDate(this.searchForm[ele.name], ele.format||"yyyy-MM-dd")
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .my-autoComplete .ivu-select-dropdown-list{
    max-height: 280px;
    overflow: auto;
    width: 180px;
  }
  .my-autoComplete .ivu-select-dropdown {
    /*left: 0 !important;*/
  }
</style>

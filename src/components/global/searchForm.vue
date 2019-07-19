<template>
  <Form ref="formInline"
        :model="searchForm"
        inline
        v-if="searchItems && searchItems.length">
    <FormItem v-for="item in searchItems" :key="item.label">
      <Input v-if="item.type=='input'"
             v-model="item.value"
             :placeholder="'请输入'+item.label"
             :style="item.style"></Input>
      <DatePicker v-if="item.type=='date' || item.type=='month'"
                  @on-change="item.onChange1?item.onChange1($event):''"
                  :type='item.type'
                  :placeholder="'请输入'+item.label"
                  v-model="item.value"
                  :options="item.options"
                  :format="item.format||'yyyy-MM-dd'"
                  :style="item.style"></DatePicker>
      <Select v-if="item.type=='select'"
              v-model="item.value"
              :placeholder="'请选择'+item.label"
              :style="item.style">
        <Option v-for="sitem in item.data"
                :value="sitem.value"
                :key="sitem.value">{{ sitem.label }}</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button type="primary" icon="ios-search" @click="searchSubmit()">搜索</Button>
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
    }
  },
  props: ['searchItems','exportItem','url','params'],
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

              if(element.name == 'startDate' ||
                element.name == 'orderTimeStart' ||
                element.name == 'date'){
                startDateItem = element
                // 初始化时间限制
                // onChange1是添加的中间函数
                if(!element.onChange1){
                  element.options.disabledDate = element.disabledDate
                }
              }
              if(element.name == 'endDate' ||  element.name == 'orderTimeEnd'){
                endDateItem = element
                // 初始化时间限制
                if(!element.onChange1){
                  element.options.disabledDate = element.disabledDate
                }
              }
              this.$set(this.searchForm, element.name, element.value)
            }
          })

          // 开始时间结束时间限制
          if(startDateItem && endDateItem){
            startDateItem.onChange1=(date1)=>{
              // console.log(this.$refs.search.searchForm)
              if(startDateItem.onChange){
                startDateItem.onChange(date1)
              }
              endDateItem.options.disabledDate=date2=>{
                let disabled = false
                if(endDateItem.disabledDate){
                  disabled = endDateItem.disabledDate(date2)
                }
                if(date2.getTime()<new Date(this.formateDateStr(date1)).getTime()){
                  // 结束日期不得小于开始日期
                  disabled = true
                }
                return disabled
              }
            }
            endDateItem.onChange1=(date1)=>{
              // console.log(this.$refs.search.searchForm)
              if(endDateItem.onChange){
                endDateItem.onChange(date1)
              }
              startDateItem.options.disabledDate=date2=>{
                let disabled = false
                if(startDateItem.disabledDate){
                  disabled = startDateItem.disabledDate(date2)
                }
                if(date2.getTime()>new Date(this.formateDateStr(date1)).getTime()){
                  // 开始日期不得大于结束日期
                  disabled = true
                }
                return disabled
              }
            }
          }
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
    searchSubmit () {
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
      this.$store.dispatch('getList').then(res=>{
        this.$emit('afterSubmit',res)
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
    },
    formateDateStr(str){
      // 日期转为时间戳，如果不带时分秒，则存在时差
      if(str.length <19){
        str += ' 00:00:00'.substring(10-str.length)
      }
      return str
    }
  }
}
</script>

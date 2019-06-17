<template>
  <Form ref="formInline"
        :model="searchForm"
        inline
        v-show="searchItems.length">
    <FormItem v-for="item in searchItems" :key="item.label">
      <Input v-if="item.type=='input'"
             v-model="item.value"
             :placeholder="'请输入'+item.label"
             :style="item.style"></Input>
      <DatePicker v-if="item.type=='date'"
                  type="date"
                  :placeholder="'请输入'+item.label"
                  v-model="item.value"
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
      searchForm: {}
    }
  },
  props: ['searchItems','exportItem','url'],
  mounted () {

  },
  methods: {
    searchSubmit () {
      // 格式化日期
      this.formateDate()
      this.$store.state.list.url = this.url;
      this.$store.state.list.params = Object.assign(
        this.$store.state.list.params,
        this.searchForm
      );
       this.$store.state.list.params.limit = this.limit
      this.$store.dispatch('getList')
    },
    formateDate(){
      // 格式化日期
      // this.searchForm.startDate += ' 00:00:00'
      // this.searchForm.endDate += ' 23:59:59'
      this.searchItems.forEach(ele=>{
        if(this.searchForm[ele.name] instanceof Date){
          this.searchForm[ele.name] = this.common.formatDate(this.searchForm[ele.name], ele.format||"yyyy-MM-dd")
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <Form ref="formInline" :model="searchForm" inline v-show="searchItems.length">
      <FormItem v-for="item in searchItems" :key="item.label">
        <Input v-if="item.type=='input'"
               v-model="item.value"
               :placeholder="'请输入'+item.label"></Input>
        <DatePicker v-if="item.type=='date'"
                    type="date"
                    :placeholder="'请输入'+item.label"
                    v-model="item.value"
                    :format="item.format||'yyyy-MM-dd'"></DatePicker>
        <Select v-if="item.type=='select'"
                v-model="item.value"
                :placeholder="'请选择'+item.label">
          <Option v-for="sitem in item.data"
                  :value="sitem.value"
                  :key="sitem.value">{{ sitem.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="ios-search" @click="handleSubmit2()">搜索</Button>
      </FormItem>
      <FormItem v-if="exportItem">
        <Button type="primary"
                :icon="exportItem.icon"
                @click="exportItem.callback"
                :loading="exportItem.loading">{{ exportItem.title }}</Button>
      </FormItem>
    </Form>
    <Row :gutter="16" class="btn-groups" v-if="hannleItems">
      <Col span="2" v-for="item in hannleItems" :key="item.title">
        <Button type="primary"
                :icon="item.icon"
                @click="item.callback"
                :loading="item.loading">{{ item.title }}</Button>
      </Col>
    </Row>
    <div class="grids">
      <Table
        :highlight-row="highlightRow"
        style="position:static;"
        border
        stripe
        :columns="columns"
        :data="res2.rows"
        :url="url"
        @on-current-change="changeSelection2"
        @on-selection-change="changeSelection2"></Table>
      <Page :total="res2.total"
            class-name="pages"
            @on-change="changepage2"
            @on-page-size-change="pageSizeShange"
            show-total
            show-sizer
            show-elevator
            :page-size="limit"></Page>
      <!--show-sizer-->
      <!--show-elevator-->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchForm: {

        },
        limit:10,
      };
    },
    props: {
      columns:{
        type: Array
      },
      searchItems: {
        type: Array
      },
      hannleItems:{
        type: Array,
      },
      url:{
        type: String,
      },
      params:{
        type: Object,
      },
      highlightRow:{
        type: Boolean ,
      },
      exportItem:{
        type:Object
      }
    },
    watch: {
      searchItems: {
        handler(newValue, oldValue) {
          newValue.forEach((element,index) => {
            if(typeof element.value == 'undefined'){
              // 作用是监听输入框value的变化，使表单验证起作用
              this.$set(element, 'value','')
            }
            if(element.name){
              // this.formItem[element.name] = element.value
              this.$set(this.searchForm, element.name, element.value)
            }
          })
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {

    },
    created(){
      this.$store.state.list.url = this.url;
      this.$store.state.list.params = this.params
      this.loadpage();
    },
    computed: {
      res2() {
        let res = this.$store.state.list.res
        if (res && res.data) {
          return res.data;
        } else {
          return {};
        }
      }
    },
    methods: {
      pageSizeShange(limit){
        this.limit = limit
        this.loadpage()
      },
      changepage2(num) {
        this.$store.state.list.params.page = num
        this.loadpage()
      },
      changeSelection2(selection) {
        this.selection = selection
      },
      handleSubmit2() {
        this.loadpage();
      },
      loadpage() {
        this.formateDate()
        this.$store.state.list.params = Object.assign(
          this.$store.state.list.params,
          this.searchForm
        );
        this.$store.state.list.params.limit = this.limit
        this.$store.dispatch('getList')
      },
      formateDate(){
        // this.searchForm.startDate += ' 00:00:00'
        // this.searchForm.endDate += ' 23:59:59'
        this.searchItems.forEach(ele=>{
          if(this.searchForm[ele.name] instanceof Date){
            this.searchForm[ele.name] = this.common.formatDate(this.searchForm[ele.name], ele.format||"yyyy-MM-dd")
          }
        })
      }
    }
  };
</script>

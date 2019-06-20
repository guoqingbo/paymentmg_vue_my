<template>
  <div>
    <searchForm ref='search'
                :searchItems="searchItems"
                :exportItem="exportItem"
                :url="url"
                :params="params"></searchForm>
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
  import searchForm from './searchForm'
  export default {
    components:{searchForm},
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
      this.$refs.search.searchSubmit()
    },
    created(){
      // this.$store.state.list.url = this.url;
      this.$store.state.list.params = this.params
      this.$store.state.list.params.limit = this.limit
      // this.loadpage();
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
        this.$store.state.list.params.limit = this.limit = limit
        this.$refs.search.searchSubmit()
      },
      changepage2(num) {
        this.$store.state.list.params.page = num
        this.$refs.search.searchSubmit()
      },
      changeSelection2(selection) {
        this.selection = selection
      },
      // loadpage() {
      //   this.formateDate()
      //   this.$store.state.list.params = Object.assign(
      //     this.$store.state.list.params,
      //     this.searchForm
      //   );
      //   this.$store.dispatch('getList')
      // },
      // formateDate(){
      //   // this.searchForm.startDate += ' 00:00:00'
      //   // this.searchForm.endDate += ' 23:59:59'
      //   this.searchItems.forEach(ele=>{
      //     if(this.searchForm[ele.name] instanceof Date){
      //       this.searchForm[ele.name] = this.common.formatDate(this.searchForm[ele.name], ele.format||"yyyy-MM-dd")
      //     }
      //   })
      // }
    }
  };
</script>

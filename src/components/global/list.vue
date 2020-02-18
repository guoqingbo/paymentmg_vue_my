<template>
  <div>
    <searchForm ref='search'
                :searchItems="searchItems"
                :exportItem="exportItem"
                @beforeSubmit="$emit('beforeSubmit',$store.state.list.params)"
                @afterSubmit="$emit('afterSubmit',$store.state.list.res)"
                :url="url"
                :apiPrefix="apiPrefix"
                :params="params"></searchForm>
    <Row :gutter="16" class="btn-groups" v-if="hannleItems">
      <template v-for="item in hannleItems" >
        <Col span="2" v-if="common.auth(item.auth)">
          <Button type="primary"
                  :icon="item.icon"
                  @click="item.callback"
                  :loading="item.loading">{{ item.title }}</Button>
        </Col>
      </template>
    </Row>
    <div style="overflow: auto">
      <Table
        :highlight-row="highlightRow"
        :width="width"
        style="position:static;"
        border
        stripe
        :columns="columns"
        :data="res2.rows"
        :url="url"
        @on-sort-change = 'sortChange'
        @on-current-change="changeSelection2"
        @on-selection-change="changeSelection2"></Table>
      <Page :total="res2.total"
            class-name="pages"
            @on-change="changepage2"
            @on-page-size-change="pageSizeShange"
            show-total
            show-sizer
            show-elevator
            :current="$store.state.list.params.page"
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
        selection:[]
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
      apiPrefix:{
        type: String,
      },
      width:{
          type: String,
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
          if(newValue instanceof Array){
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
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      // 是否自定义搜索
      if (this._events.searchSubmit) {
        this.on("searchSubmit",this._events.searchSubmit)
      }
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
      searchSubmit(params){
        this.$refs.search.searchSubmit(params)
      },
      pageSizeShange(limit){
        this.$store.state.list.params.limit = this.limit = limit
        this.$refs.search.searchSubmit()
      },
      changepage2(num) {
        this.$store.state.list.params.page = num
        this.$refs.search.searchSubmit()
      },
      //在多选模式下有效，只要选中项发生变化时就会触发
      changeSelection2(selection) {
        this.selection = selection
      },
      // 排序
      sortChange({column,key,order}){
        this.$store.state.list.params.page = 1
        if(order === 'normal'){
          delete this.$store.state.list.params.sort
          delete this.$store.state.list.params.order
        }else{
          this.$store.state.list.params.sort = key
          this.$store.state.list.params.order = order
        }
        this.$refs.search.searchSubmit()
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

<template>
  <div>
    <Form ref="formInline" :model="searchForm" inline v-show="searchItems.length">
      <FormItem v-for="item in searchItems" :key="item.label">
        <Input v-if="item.type=='input'" v-model="searchForm[item.name]" :placeholder="'请输入'+item.label"></Input>
        <DatePicker v-if="item.type=='date'"
                    type="date"
                    :placeholder="'请输入'+item.label"
                    v-model="searchForm[item.name]"
                    format="yyyy-MM-dd"
                    @on-change="searchForm[item.name] = $event"></DatePicker>
        <Select v-if="item.type=='select'" v-model="searchForm[item.name]" :placeholder="'请选择'+item.label">
          <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="ios-search" @click="handleSubmit2()">搜索</Button>
      </FormItem>
    </Form>
    <Row :gutter="16" class="btn-groups" v-if="hannleItems">
      <Col span="2" v-for="item in hannleItems" :key="item.title">
        <Button type="primary" :icon="item.icon" @click="item.callback">{{ item.title }}</Button>
      </Col>
    </Row>
    <div class="grids">
      <Table
        :highlight-row="highlightRow"
        style="position:static;"
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
        searchForm: {},
        limit:10,
      };
    },
    props: ["searchItems", "hannleItems", "columns", "url", "params", "highlightRow"],
    mounted() {
      this.$store.state.list.url = this.url;
      this.$store.state.list.params = this.params
      this.$store.state.list.params.limit = this.limit
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
        this.$store.state.list.params.limit = limit
        this.loadpage()
      },
      changepage2(num) {
        this.$store.state.list.params.page = num
        this.loadpage()
      },
      changeSelection2(selection) {
        this.selection = selection
      },
      async handleSubmit2() {
        this.formateDate()
        this.$store.state.list.params = Object.assign(
          this.$store.state.list.params,
          this.searchForm
        );
        await this.$store.dispatch("getList");
      },
      async loadpage() {
        await this.$store.dispatch('getList')
      },
      formateDate(){
        this.searchForm.startDate += ' 00:00:00'
        this.searchForm.endDate += ' 23:59:59'
        // Object.keys(this.searchForm).forEach(ele=>{
        //   if(this.searchForm[ele] instanceof Date){
        //     this.searchForm[ele] = this.common.formatDate(this.searchForm[ele], "yyyy-MM-dd hh:mm:ss")
        //   }
        // })
      }
    }
  };
</script>

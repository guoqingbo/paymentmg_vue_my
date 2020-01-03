<template>
  <div style="width: 80%">
    <Form :model="params"
          :label-width="150"
          ref="formRef">
      <FormItem
        label="商户名称:"
        prop="merchantNo"
        :rules="[{required: true, type: 'number', message: '请选择商户名称', trigger: 'change'}]">
        <AutoComplete class="my-autoComplete"
                      v-model="params.merchantNo"
                      @on-search="searchMerchantList"
                      :clearable="true"
                      icon="ios-search"
                      placeholder="请输入商户名称">
          <Option v-for="(sitem,sindex) in autoComplete.data" :value="sitem.value" :key="sindex">{{ sitem.label }}</Option>
        </AutoComplete>
      </FormItem>
      <FormItem label="功能列表:">
        <div class="fun-type-box">
          <Button class="add-fun-btn" type="primary" @click="openFucAdd">+添加功能</Button>
          <div class="fun-type-btn-box">
            <Button v-for="(item,index) in common.dic.funType"
                    :key="index"
                    style="margin-right: 20px"
                    :type="item.value==params.type?'primary':'default'"
                    @click="chooseFunType(item)">{{item.label}}</Button>
          </div>
          <Table stripe
                 border
                 :columns="[...funListColumns,...addFunColumns]"
                 @on-selection-change="changeSelection"
                 :data="funList"></Table>
        </div>
      </FormItem>
      <div class="footer">
        <Button @click="$router.go(-1)" style="margin-right: 30px">返回
        </Button>
        <Button type="primary" @click="addFun">确定</Button>
      </div>
    </Form>
    <!--添加功能-->
    <Modal v-model="addFunModal"
           title="添加功能"
           width="750">
      <div class="fun-type-box">
        <div class="fun-type-btn-box">
          <Button v-for="(item,index) in common.dic.funType"
                  :key="index"
                  style="margin-right: 20px"
                  :type="item.value==funSearchParams.type?'primary':'default'"
                  @click="chooseFunType(item)">{{item.label}}</Button>
          <div class="search-box">
            <Select clearable v-model="funSearchParams.channelCode" style="width:200px" placeholder="请选择服务商">
              <Option v-for="item in channelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary"
                    @click="getChannelProduct()">查询</Button>
          </div>
          <Table stripe
                 border
                 :columns="[...selectFunColumns,...funListColumns]"
                 @on-selection-change="changeSelection"
                 :data="funListData"></Table>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancel">取消
        </Button>
        <Button type="primary" @click="addFunPop">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>


  export default {
    components: {},
    name: "merchantFunAddEditDetail",
    data(){
      return {
        autoComplete:{
          data:[]
        },
        funList:[],
        funSelected:[],
        addFunModal:false,
        channelList:[],
        funListColumns:[
          {
            title: '服务商',
            key: 'channelName'
          },
          {
            title: '支付产品',
            key: 'payProductName'
          },
          {
            title: '功能名称',
            key: 'channelProductName'
          },
          {
            title: '功能分类',
            key: 'type',
            render: (h, params) => {
              return h('span', this.filter.turn("funType",params.row.type))
            }
          },
          {
            title: '功能代码',
            key: 'channelProductCode'
          }
        ],
        // tabIndex:1,
        addFunColumns:[
          {
            title: '操作',
            key: 'action',
            width:200,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title:'操作',
                  type:'dropdown',
                  data:[
                    {
                      label:'删除',
                      value:'1',
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      this.funList.forEach((ele,index)=>{
                        // 已经选中过的不可再选
                        let {channelProductCode,payProductCode} = params.row
                        if(channelProductCode == ele.channelProductCode && payProductCode ==ele.payProductCode){
                          this.funList.splice(index,1)
                        }
                      })
                    }
                  }
                }
              ]
              return this.common.columnsItemRender(h, actions);
            }
          }
        ],
        selectFunColumns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
        ],
        funListData:[],
        selection:[],
        funSearchParams:{
          type:'0',
          channelCode:''
        },
        funSelected:[],
        params:{
          merchantNo:''
        },
      }
    },
    methods:{
      searchMerchantList(value){
        this.common.searchMerchantList(value,this.autoComplete)
      },
      changeSelection (selection) {
        this.selection = selection
      },
      // 选择功能分类
      chooseFunType(item){
        this.funSearchParams.type = item.value
        this.funListData = []
      },
      //  打开添加功能弹框
      openFucAdd(){
        this.addFunModal = true
        this.chooseFunType(this.common.dic.funType[0])
        this.getChannel()
      },
      // 获取支付渠道
      getChannel(){
        this.$store.dispatch("getChannel").then(res=>{
          this.channelList = res
        })
      },
      // 获取功能列表
      getChannelProduct(){
        if(!this.funSearchParams.channelCode){
          this.$Message.warning('请先选择服务商')
          return
        }
        let url = '/payProductChannel/channelProductGrid'
        this.apiGet(url,this.funSearchParams).then(res=>{
          if(res.success){
            this.funListData = res.data.rows

            this.funListData.forEach(ele=>{
              // 已经选中过的不可再选
              if(this.funSelected.includes(ele.channelProductCode+"_"+ele.payProductCode)){
                ele._checked = true
                ele._disabled = true
              }
              // 功能支付为分类，但没有支付产品不可选
              if(ele.type == 0 && !ele.payProductName){
                ele._disabled = true
              }
            })
          }else{
            this.funListData = []
          }
        })
      },
      // 添加功能取消
      cancel(){
        this.addFunModal = false
        this.selection = []
      },
      addFunPop(){
        this.addFunModal = false
        let funSelected = []
        this.funList.forEach(ele=>{
          funSelected.push(ele.channelProductCode+"_"+ele.payProductCode)
        })
        this.funSelected = funSelected

        this.selection.forEach(ele=>{
          // 去除已经添加的功能
          if(!this.funSelected.includes(ele.channelProductCode+"_"+ele.payProductCode)){
            this.funList.push(ele)
          }
        })
      },
      // 添加功能确认
      addFun(){
        if(!this.selection.length){
          this.$Message.warning('请先选择要添加的功能')
          return
        }
        let url = '/merchantChannel/batchSave'
        let params = {
          appId:this.appDetail.id,
          ids:''
        }
        let ids = []
        this.selection.forEach(ele=>{
          // 去除已经添加的功能
          if(!this.funSelected.includes(ele.channelProductCode+"_"+ele.payProductCode)){
            ids.push(ele.id)
          }
        })
        if(!ids.length){
          this.$Message.warning('未选择要添加的功能')
          return
        }
        params.ids = ids.join(',')
        this.apiPost(url,params).then(res=>{
          if(res.success){
            this.$Message.success('添加成功')
            // 刷线页面
            this.getDetail()
          }else{
            this.$Message.warning(res.message)
          }
        })
        this.addFunModal = false
      },
    }
  }
</script>
<style scoped lang="scss">
  .my-autoComplete .ivu-select-dropdown {
    left: 0 !important;
  }
  .my-autoComplete .ivu-select-dropdown-list{
    max-height: 280px;
    overflow: auto;
  }
  .fun-type-btn-box{
    margin: 20px 0;
    .search-box{
      padding: 20px 0;
    }
  }
  .footer{
    text-align: center;
  }
</style>

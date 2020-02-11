<template>
  <div style="width: 80%">
    <Form :model="params"
          :label-width="150"
          ref="formRef">
      <FormItem
        label="商户名称:"
        prop="merchantNo"
        :rules="routeType!=='detail'?[{required: true, message: '请选择商户名称', trigger: 'change'}]:{}">
        <!--如果是详情页        -->
        <span v-if="routeType=='detail'">{{params.merchantNo}}</span>
        <AutoComplete class="my-autoComplete"
                      v-else
                      v-model="params.merchantNo"
                      @on-search="searchMerchantList"
                      :clearable="true"
                      icon="ios-search"
                      placeholder="请输入商户名称">
          <Option v-for="(sitem,sindex) in autoComplete.data" :value="sitem.value" :key="sindex">{{ sitem.label }}</Option>
        </AutoComplete>
      </FormItem>
      <div style="display: flex;flex: 0">
        <div style="width: 150px;flex-shrink:0;text-align: right;padding-right: 12px">功能列表:</div>
        <div class="fun-type-box">
          <Button class="add-fun-btn"
                  v-if="routeType!=='detail'"
                  type="primary"
                  @click="openFucAdd">+添加功能</Button>
          <div class="fun-type-btn-box">
            <Button v-for="(item,index) in common.dic.funType"
                    :key="index"
                    style="margin-right: 20px"
                    :type="item.value==funSearchParams.type?'primary':'default'"
                    @click="chooseFunType(item)">{{item.label}}</Button>
          </div>
          <Table
                 stripe
                 border
                 :columns="routeType=='detail'?[...funListColumns,...addOrderSourceColumns]:[...funListColumns,...addOrderSourceColumns,...addFunColumns]"
                 @on-selection-change="changeSelection"
                 :data="funList|funListFilter(funSearchParams.type)"></Table>
        </div>
      </div>
      <div class="footer" style="padding-top: 20px">
        <Button @click="$router.go(-1)" style="margin-right: 30px">返回
        </Button>
        <Button type="primary" v-if="routeType!=='detail'"  @click="addFun">确定</Button>
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
              <Option v-for="(item,index) in channelList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <Button type="primary"
                    @click="getChannelProduct()">查询</Button>
          </div>
          <Table stripe
                 style="overflow: visible"
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
    <!--配置应用-->
    <Modal v-model="funConfigModal"
           title="配置应用"
           @on-ok="addFunConfig"
           width="750">
      <Form :model="funConfigParam"
            ref="formRef">
        <FormItem prop="orderSource"
                  :rules="[{required: true, message: '请选择应用来源', trigger: 'change'}]">
          <Select v-model="funConfigParam.orderSource"
                  placeholder="请选择应用配置">
            <Option v-for="sitem in orderSourceList"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}
            </Option>
          </Select>
          <div style="color: #f00">请选择应用来源，不同的应用来源配置不同的功能</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>

  import modalForm from '@/components/global/modalForm'
  export default {
    components: {modalForm},
    name: "merchantFunAddEditDetail",
    filters:{
      funListFilter(value,type){
        return value.filter(ele=>{
          if(ele.type==type){
            return true
          }else{
            return false
          }
        })
      }
    },
    data(){
      return {
        detail:{},
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
          },
        ],
        addOrderSourceColumns:[
          {
            title: '应用来源',
            key: 'orderSource',
            width:'150',
            align:'center',
            render: (h, params) => {

            }
          },
        ],
        // tabIndex:1,
        addFunColumns:[
          {
            title: '操作',
            key: 'action',
            width:100,
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
                    },
                    {
                      label:'配置应用',
                      value:'2',
                    }
                  ],
                  value:"",
                  onClick:(value)=>{
                    if(value == 1){
                      // 删除
                      this.funList.forEach((ele,index)=>{
                        let {channelProductCode,payProductCode} = params.row
                        if(channelProductCode == ele.channelProductCode && payProductCode ==ele.payProductCode){
                          this.funList.splice(index,1)
                        }
                      })
                    }else if(value == 2){
                      // 配置应用
                      this.funConfigModal = true
                      this.funItem = this.funList[params.index]
                      this.getOrderSource()
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
        // 应用配置参数
        funItem:{},
        funConfigModal:false,
        funConfigParam:{
          orderSource:''
        },
        orderSourceList:[],
        routeType:this.$route.query.routeType
      }
    },
    created(){
      // 设置应用来源render
      this.orderSourceRender()

      if(this.$route.query.id){
        this.getDetail()
      }
    },
    methods:{
      // 设置应用来源render
      orderSourceRender(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          let orderSourceObj =  {}
          res.forEach(ele=>{
            orderSourceObj[ele.value] = ele.label
          })
          this.addOrderSourceColumns[0].render=(h, params)=>{
            let arr = []
            if(params.row.orderSource){
              let orderSource = params.row.orderSource.toString().split(",")
              orderSource.forEach((ele,index)=>{
                let deleteBtn = h('Icon',{
                  props:{
                    type:'md-close-circle',
                    size:'15'
                  },
                  style:{
                    position:"absolute",
                    right:'-5px',
                    // top:'-2px'
                  },
                  on:{
                    click:()=>{
                      orderSource.splice(index,1)
                      this.funList[params.row._index].orderSource = orderSource.join(',')
                    }
                  }
                })
                arr.push(h('span', {
                  style: {
                    position:'relative',
                    // display:'inline-block',
                    borderRadius:'20px',
                    border:'1px solid #ccc',
                    padding:'0 10px',
                    marginRight:'5px',
                    whiteSpace: "nowrap"
                  },
                  on: {
                    // click: () => {
                    //
                    // }
                  }
                },[orderSourceObj[ele],deleteBtn]))
              })
              return arr
            }
          }
        })

      },
      // 获取详情
      getDetail(){
        let url = '/configMerchantChannel/detail'
        let params = {
          merchantNo:this.$route.query.id
        }
        this.apiGet(url,params).then(res=>{
          if(res.success){
            this.detail = res.data
            // 设置字段值
            this.params.merchantNo = this.detail.merchantName+"("+this.detail.merchantNo+")"
            this.funList = this.detail.list
          }else{
            this.$Message.warning(res.message)
          }
        })
      },

      // 添加应用来源
      addFunConfig(){
        let orderSource = []
        if(this.funItem.orderSource){
          orderSource =  this.funItem.orderSource.toString().split(",")
        }
        if(!orderSource.includes(this.funConfigParam.orderSource)){
         orderSource.push(this.funConfigParam.orderSource)
        }
        this.$set(this.funItem,'orderSource',orderSource.join(","))
      },
      // 获取应用来源
      getOrderSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          this.orderSourceList = res
        })
      },
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
        // 默认先择第一个功能分类
        this.funListData = []
        // 获取已经选择的功能
        this.getFunSelected()
        // 获取渠道
        this.getChannel()
      },
      // 获取已经选择的功能
      getFunSelected(){
        let funSelected = []
        this.funList.forEach(ele=>{
          funSelected.push(ele.channelProductCode+"_"+ele.payProductCode)
        })
        this.funSelected = funSelected
        return funSelected
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
        // 获取已经选择的功能
        this.getFunSelected()

        this.selection.forEach(ele=>{
          // 去除已经添加的功能
          if(!this.funSelected.includes(ele.channelProductCode+"_"+ele.payProductCode)){
            this.funList.push(ele)
          }
        })
      },
      // 添加功能确认
      addFun(){
        if(!this.funList.length){
          this.$Message.warning('请先选择要添加的功能')
          return
        }
        let url = '/configMerchantChannel/edit'
        let {merchantNo,merchantName} = this.common.splitMerchant({...this.params})
        // 获取
        let configRelated = []
        this.funList.forEach(ele=>{
          configRelated.push({
            payProductCode :ele.payProductCode,
            channelProductCode:ele.channelProductCode,
            orderSource:ele.orderSource,
          })
        })
        let params = {
          merchantNo,
          merchantName,
          configRelatedJson:JSON.stringify(configRelated)
        }
        if(this.routeType== 'edit'){
          params.id = this.detail.id
        }
        this.apiPost(url,params).then(res=>{
          if(res.success){
            this.$Message.success(res.message||'操作成功')
            // 刷线页面
            this.$router.go(-1)
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
  .fun-type-box{
    width: 100%;
  }
  .fun-list-box{

  }
</style>

<template>
  <div style="width: 80%">
    <div class="fun-type-box">
      <Row>
        <Col span="12">
          <p style="font-size: 14px">商户</p>
          <p style="font-size: 12px;color: #2d8cf0">所有商户默认的功能选项</p>
        </Col>
        <Col span="12"
             v-if="common.authList.includes('merchantSettingAdd')"
             style="text-align: right">
          <Button class="add-fun-btn"
                  type="primary"
                  @click="openFucAdd">添加
          </Button>
        </Col>
      </Row>
      <Row class="fun-type-btn-box">
        <Col span="20">
          <Button style="margin-right: 20px"
                  :type="!params.type?'primary':'default'"
                  @click="chooseFunType()">全部
          </Button>
          <Button v-for="(item,index) in common.dic.funType"
                  :key="index"
                  style="margin-right: 20px"
                  :type="item.value==params.type?'primary':'default'"
                  @click="chooseFunType(item)">{{item.label+"("+(res.typeMap[item.value]||0)+")"}}
          </Button>
        </Col>
        <Col span="4" style="text-align: right">
          <Select clearable
                  @on-change="platformChange"
                  v-model="params.orderSource"
                  style="width:100px;text-align: left" placeholder="请选择平台">
            <Option v-for="(item,index) in common.dic.platform" :value="item.value" :key="index">{{ item.label }}
            </Option>
          </Select>
        </Col>
      </Row>
      <Table
        style="overflow: visible"
        stripe
        border
        :columns="funListColumns"
        @on-selection-change="changeSelection"
        :data="res.defaultDataGrid.rows"></Table>
      <Page :total="res.defaultDataGrid.total"
            class-name="pages"
            @on-change="changepage"
            @on-page-size-change="pageSizeShange"
            show-total
            show-sizer
            show-elevator
            :current="params.page"
            :page-size="params.limit"></Page>
    </div>
    <!--添加功能-->
    <Modal v-model="addFunModal"
           title="添加功能"
           width="750">
      <div>
        <p style="margin-bottom: 10px">选择平台</p>
        <Select clearable v-model="addFunParams.orderSource" style="width:100%" placeholder="请选择平台">
          <Option v-for="(item,index) in orderSource" :value="item.value" :key="index">{{ item.label }}
          </Option>
        </Select>
      </div>
      <div class="fun-type-box">
        <div class="fun-type-btn-box">
          <Button v-for="(item,index) in common.dic.funType"
                  :key="index"
                  style="margin-right: 20px"
                  :type="item.value==funSearchParams.type?'primary':'default'"
                  @click="chooseAddFunType(item)">{{item.label}}
          </Button>
          <div class="search-box">
            <Select clearable v-model="funSearchParams.channelCode" style="width:200px" placeholder="请选择服务商">
              <Option v-for="(item,index) in channelList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <Button type="primary"
                    @click="getChannelProduct()">查询
            </Button>
          </div>
          <Table stripe
                 style="overflow: visible"
                 border
                 :columns="selectFunColumns"
                 @on-selection-change="changeSelection"
                 :data="funListData"></Table>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancel">取消
        </Button>
        <Button type="primary" @click="addFun">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

    import modalForm from '@/components/global/modalForm'

    export default {
        components: {modalForm},
        data() {
            return {
                orderSource:[],
                params: {
                    type: '',
                    orderSource: '',
                    page:1,
                    limit:10,
                },
                res: {
                    defaultDataGrid:{
                        total:0,
                        rows:[]
                    },
                    typeMap:{},
                },
                funListData:[],
                funSelected: [],
                addFunModal: false,
                channelList: [],
                funListColumns: [
                    {
                        title: '服务商',
                        key: 'channelName'
                    },
                    {
                        title: '功能名称',
                        key: 'channelProductName'
                    },
                    {
                        title: '所属平台',
                        key: 'orderSource',
                        render: (h, params) => {
                            // return h('span', this.filter.turn("platform", params.row.orderSource))
                        }
                    },
                    {
                        title: '功能代码',
                        key: 'channelProductCode'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            const actions = [
                                {
                                    title: '操作',
                                    type: 'dropdown',
                                    auth:'merchantSettingDelete',
                                    data: [
                                        {
                                            label: '删除',
                                            value: '1',
                                        }
                                    ],
                                    value: "",
                                    onClick: (value) => {
                                        if (value == 1) {
                                            // 删除
                                            this.$Modal.confirm({
                                                title: '删除',
                                                content: '确定删除？',
                                                onOk: () => {
                                                    let url = '/configDefaultChannel/delete/'+params.row.id
                                                    this.apiGet(url).then(res=>{
                                                        if(res.success){
                                                            this.$Message.info(res.message||'删除成功')
                                                            this.getList()
                                                        }else{
                                                            this.$Message.warning(res.message)
                                                        }
                                                    })
                                                },
                                                onCancel: () => {

                                                }
                                            });
                                        }
                                    }
                                }
                            ]
                            return this.common.columnsItemRender(h, actions);
                        }
                    }
                ],
                selectFunColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '服务商',
                        key: 'channelName'
                    },
                    {
                        title: '产品分类',
                        key: 'payProductName'
                    },
                    {
                        title: '功能名称',
                        key: 'channelProductName'
                    },
                    {
                        title: '功能代码',
                        key: 'channelProductCode'
                    },
                ],
                selection: [],
                funSelected: [],
                addFunParams: {
                    orderSource:'',
                },
                funSearchParams:{
                    type:'0',
                    channelCode:''
                },
                routeType: this.$route.query.routeType
            }
        },
        // computed:{
        //     addAuth(){
        //         this.common.auth()
        //     }
        // },
        created(){
            // 获取应用来源
            this.getMerchantSource()
            this.getList()
        },
        methods: {
            // 获取应用来源
            getMerchantSource(){
                this.$store.dispatch("getMerchantSource").then(res=>{
                    // let merchantSource = res
                    // this.common.setArrItem(this.searchItems,'orderSource',{data:res,})

                    // 表格商户来源转换
                    this.orderSource = res
                    let source={}
                    res.forEach(ele=>{
                        source[ele.value] = ele.label
                    })
                    this.common.setArrItem(this.funListColumns,'key=orderSource',{
                        render:(h, params) => {
                            return h('span', source[params.row.orderSource])
                        }
                    })
                })
            },
            platformChange(value){
                this.params.orderSource = value
                this.getList()
            },
            pageSizeShange(limit) {
                this.$store.state.list.params.limit = this.limit = limit
                this.$refs.search.searchSubmit()
            },
            changepage(num) {
                this.params.page = num
                this.getList()
            },
            // 获取详情
            getList() {
                let url = '/configDefaultChannel/grid'
                this.apiGet(url, this.params).then(res => {
                    if (res.success) {
                        this.res = res.data
                    } else {
                        this.$Message.warning(res.message)
                    }
                })
            },

            // 添加应用来源
            addFunConfig() {
                let orderSource = []
                if (this.funItem.orderSource) {
                    orderSource = this.funItem.orderSource.toString().split(",")
                }
                if (!orderSource.includes(this.funConfigParam.orderSource)) {
                    orderSource.push(this.funConfigParam.orderSource)
                }
                this.$set(this.funItem, 'orderSource', orderSource.join(","))
            },
            changeSelection(selection) {
                this.selection = selection
            },
            // 选择功能分类
            chooseFunType(item) {
                if(item){
                    this.params.type = item.value
                }else{
                    this.params.type = ''
                }
                this.getList()
            },
            // 选择功能分类
            chooseAddFunType(item) {
                if(item){
                    this.funSearchParams.type = item.value
                }else{
                    this.params.type = ''
                }
            },
            //  打开添加功能弹框
            openFucAdd() {
                this.addFunModal = true
                this.funListData = []
                // 获取已经选择的功能
                this.getFunSelected()
                // 获取渠道
                this.getChannel()
            },
            // 获取已经选择的功能
            getFunSelected() {
                let funSelected = []
                this.res.defaultDataGrid.rows.forEach(ele => {
                    funSelected.push(ele.channelProductCode + "_" + ele.payProductCode)
                })
                this.funSelected = funSelected
                return funSelected
            },
            // 获取支付渠道
            getChannel() {
                this.$store.dispatch("getChannel").then(res => {
                    this.channelList = res
                })
            },
            // 获取功能列表
            getChannelProduct() {
                if(!this.funSearchParams.channelCode){
                    this.$Message.warning('请先选择服务商')
                    return
                }
                let url = '/payProductChannel/channelProductGrid'
                this.apiGet(url, this.funSearchParams).then(res => {
                    if (res.success) {
                        this.funListData = res.data.rows

                        this.funListData

                        this.funListData.forEach(ele => {
                            // 已经选中过的不可再选
                            if (this.funSelected.includes(ele.channelProductCode + "_" + ele.payProductCode)) {
                                ele._checked = true
                                ele._disabled = true
                            }
                            // 功能支付为分类，但没有支付产品不可选
                            if (ele.type == 0 && !ele.payProductName) {
                                ele._disabled = true
                            }
                        })
                    } else {
                        this.funListData = []
                    }
                })
            },
            // 添加功能取消
            cancel() {
                this.addFunModal = false
                this.selection = []
            },
            // 添加功能确认
            addFun(){
                if(!this.addFunParams.orderSource){
                    this.$Message.warning('请先选择平台')
                    return
                } else if(!this.selection.length){
                    this.$Message.warning('请先选择要添加的功能')
                    return
                }
                let url = '/configDefaultChannel/batchSave'
                let params = {
                    orderSource:this.addFunParams.orderSource,
                    ids:'',
                    type:this.funSearchParams.type,
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
                        this.params = {
                            type: '',
                            orderSource: '',
                            page:1,
                            limit:10,
                        },
                        // 刷线页面
                        this.getList()
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
  .fun-type-btn-box {
    margin: 20px 0;

    .search-box {
      padding: 20px 0;
    }
  }

  .footer {
    text-align: center;
  }

  .fun-type-box {
    width: 100%;
  }

  .fun-list-box {

  }
</style>

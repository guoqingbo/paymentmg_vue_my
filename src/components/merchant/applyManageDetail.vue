<template>
  <div class="apply-manage-box">
    <div>
      <!--头部信息-->
      <div class="apply-manage-top">
        <img class="apply-icon" :src='appDetail.appLogo || headerImg'>
        <div class="apply-info-box">
          <div class="apply-info-top">
            <span class="apply-info-name">{{appDetail.appName}}</span>
            <!--<Button type="primary" size="small" @click="openApplyEdit">编辑</Button>-->
            <span class="default-btn" @click="openApplyEdit">编辑</span>
          </div>
          <div class="apply-info-bottom">
            <span class="apply-info-payId">PAYID</span>
            <span class="apply-info-payId-value">{{appDetail.payId}}</span>
          </div>
        </div>
      </div>
      <!--tab选项卡-->
      <div class="tab-box">
        <div class="tab-item" @click="tabClick(1)" :class="{active:tabIndex==1}">
          <span class="tab-item-name">应用概述</span>
        </div>
        <div class="tab-item" @click="tabClick(2)" :class="{active:tabIndex==2}">
          <!--<span class="tab-item-tag">{{appDetail.functionStatusName}}</span>-->
          <span class="tab-item-name">功能管理</span>
        </div>
        <div class="tab-item" @click="tabClick(3)" :class="{active:tabIndex==3}">
          <span class="tab-item-name">开发配置</span>
        </div>
      </div>
      <!--选项卡内容-->
      <div class="tab-content-box">
        <!--应用概述-->
        <div class="apply-summary-box" v-if="tabIndex==1">
          <table class="apply-info-table">
            <tr>
              <td>
                <span class="apply-info-label">应用名称：</span>
                <span class="apply-info-value">{{appDetail.appName}}</span>
              </td>
              <td>
                <span class="apply-info-label">应用来源：</span>
                <span class="apply-info-value">{{appDetail.orderSourceName}}</span>
              </td>
              <td>
                <span class="apply-info-label">创建时间：</span>
                <span class="apply-info-value">{{appDetail.createTime}}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="apply-info-label">所属商户：</span>
                <span class="apply-info-value">{{appDetail.merchantName}}</span>
              </td>
              <td>
                <span class="apply-info-label">应用状态：</span>
                <span class="apply-info-value">{{appDetail.appStatusName}}</span>
              </td>
              <td>
                <span class="apply-info-label">最近更新时间：</span>
                <span class="apply-info-value">{{appDetail.modifyTime}}</span>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <span class="apply-info-label">应用描述：</span>
                <span class="apply-info-value">{{appDetail.description}}</span>
              </td>
            </tr>
          </table>
          <div class="apply-fun-box">
            <div class="apply-section-title">应用功能：</div>
            <Table stripe
                   border
                   :columns="funColumns"
                   :data="appDetail.merchantChannelList"></Table>
          </div>
        </div>
        <!--功能管理-->
        <div class="fun-manage-box" v-if="tabIndex==2">
          <div class="add-fun-btn-box">
            <Button type="primary" @click="openFucAdd" icon="md-add">添加功能</Button>
            <!--<span class="add-fun-tip">-->
              <!--<Icon type="md-alert" size="16"/>-->
              <!--请先通过“添加功能”添加所需的功能，再通过“配置”功能服务配置参数-->
            <!--</span>-->
          </div>
          <Table stripe
                 border
                 :columns="[...funColumns,...addFunColumns]"
                 :data="appDetail.merchantChannelList"></Table>
        </div>
        <!--开发配置-->
        <div class="dev-config-box" v-if="tabIndex==3">
          <div class="dev-config-info-top">
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">商户号（merchantNo）：</span>
              <span class="dev-config-info-value">{{configInfo.merchantNo}}</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">支付标识（PayID）：</span>
              <span class="dev-config-info-value">{{configInfo.payId}}</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">商户/平台私钥（RSA私钥）：</span>
              <span class="dev-config-info-value">{{configInfo.mchPrivateKeyShort}}</span>
              <span class="default-btn" v-clipboard:copy="configInfo.mchPrivateKey" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
              <!--<Button type="primary" size="small" v-clipboard:copy="configInfo.mchPrivateKey" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>-->
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">支付中心公钥（RSA公钥）：</span>
              <span class="dev-config-info-value">{{configInfo.publicKeyShort}}</span>
              <span class="default-btn" v-clipboard:copy="configInfo.publicKey" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
              <!--<Button type="primary" size="small" v-clipboard:copy="configInfo.publicKey" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>-->
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">正式环境地址：</span>
              <span class="dev-config-info-value">{{configInfo.url}}</span>
            </div>
          </div>
          <div class="apply-section-title">
            <span>开发者信息</span>
            <span class="default-btn" @click="openDeveloperEdit">编辑</span>
            <!--<Button type="primary" size="small" @click="openDeveloperEdit">编辑</Button>-->
          </div>
          <div class="developer-info-box">
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">开发管理员：</span>
              <span class="dev-config-info-value">{{configInfo.developer}}</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">手机号码：</span>
              <span class="dev-config-info-value">{{configInfo.phone}}</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">邮箱地址：</span>
              <span class="dev-config-info-value">{{configInfo.email}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--编辑应用-->
    <modalForm v-model="applyEditformShow"
               :formItems="applyEditformItems"
               @beforeSave='beforeSave'
               @on-success="onSuccess"
               :url="applyEditFormUrl"
               title="编辑应用">
    </modalForm>
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
                 :columns="funListColumns"
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
    <!--编辑开发者信息-->
    <modalForm v-model="developerEditformShow"
               :formItems="developerEditformItems"
               @beforeSave='beforeSave'
               @on-success="onSuccessDeveloper"
               :url="developerEditFormUrl"
               title="开发者信息">
    </modalForm>

    <confirm ref="confirmModel"
             :content="content"
             @sucessDone="sucessDone"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
  </div>
</template>
<script>
  import modalForm from '@/components/global/modalForm'
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        mode: "",
        content: "",
        sucessMsg: "",
        appDetail:{},
        funSelected:[],
        configInfo:{},
        headerImg:require("../../assets/images/touxiang.png"),
        applyEditformShow:false,
        applyEditformItems: [
          {
            title: '应用名称',
            name: 'appName',
            type: 'input',
            rules: [
              {required: true, message: '请输入应用名称', trigger: 'blur'},
              {max: 32, message: "应用名称不超过32字符", trigger: 'blur'}
            ],
            value: ""
          },
          {
            title: '应用图标',
            name: 'appLogo',
            type: 'uploadFile',
            accept:'.jpg,.jpeg,.png',
            tip: '请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于2M',
            value:''
          },
          {
            title: '应用描述',
            name: 'description',
            type: 'textarea',
            value: '',
            disabled: false,
          },
          {
            title: '适用场景',
            name: 'appScene',
            type: 'select',
            data: this.common.dic.appScene,
            rules: [
              {required: true,message: '请选择适用场景', trigger: 'change'}
            ],
            value: ''
          },
          {
            title: '应用状态',
            name: 'appStatus',
            type: 'select',
            data: this.common.dic.appStatus,
            rules: [
              {required: true,message: '请选择应用状态', trigger: 'change'}
            ],
            value: ''
          },
      ],
        applyEditFormUrl:'/merchantApp/updateAppInfo',
        funColumns:[
          {
            title: '功能名称',
            key: 'channelProductName',
            className:'fun-name',
            align:'center',
            render: (h, params) => {
              let array = []
              array.push(h('router-link', {
                  props: {
                    to: {
                      path: "/merchant/applyConfig",
                      query: {
                        id: params.row.id,
                        routeType:'detail'
                      }
                    },
                  }
                },params.row.channelProductName))
              if(params.row.priority){
                array.push(h('span', {class: 'fun-name-tip'},'优先'))
              }
              return array
            }
          },
          {
            title: '功能服务商',
            key: 'channelName',
            align:'center',
          },
          {
            title: '支付产品',
            key: 'payProductName',
            align:'center',
          },
          {
            title: '功能代码',
            key: 'channelProductCode',
            align:'center',
          },
          {
            title: '功能分类',
            key: 'type',
            align:'center',
            render: (h, params) => {
              return h('span', this.filter.turn("funType",params.row.type))
            }

          },
          {
            title: '状态',
            key: 'functionStatus',
            align:'center',
            render: (h, params) => {
              let array = []
              let color=''
              if(params.row.functionStatus == 0){
                color='#f00'
              }else if(params.row.functionStatus == 1){
                color='#2b85e4'
              }
              let style = {
                backgroundColor:color,
                fontSize:'16px',
                width:'10px',
                height:'10px',
                display:'inline-block',
                borderRadius:'10px',
                marginRight:'8px'
              }
              array.push(h('span', {style}))
              array.push(h('span', this.filter.turn("functionStatus",params.row.functionStatus)))
              return array
            }
          },
          {
            title: '添加时间',
            key: 'createTime',
            align:'center',
          }
        ],
        // tabIndex:1,
        addFunColumns:[
          {
            title: '操作',
            key: 'action',
            width:140,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title: "配置",
                  action: () => {
                    this.$router.push({
                      path: "/merchant/applyConfig",
                      query: {
                        id: params.row.id,
                      }
                    });
                  }
                },
                {
                  title: "删除",
                  action: () => {
                    this.mode = "delete";
                    this.sucessMsg = "删除成功！";
                    this.content = "确定删除？";
                    this.$refs.confirmModel.confirm(
                      "/merchantChannel/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        addFunModal:false,
        channelList:[],
        funListColumns:[
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
        funListData:[],
        selection:[],
        funSearchParams:{
          type:'0',
          channelCode:''
        },
        developerEditformShow:false,
        developerEditformItems: [
          {
            title: '开发管理员',
            name: 'developer',
            type: 'input',
            rules: [
              {required: true, message: '请输入开发管理员', trigger: 'blur'},
              {max: 32, message: "应用名称不超过32字符", trigger: 'blur'}
            ],
            value: ""
          },
          {
            title: '手机号码',
            name: 'phone',
            type: 'input',
            rules: [{
              validator: this.common.validate.phone,
              required: true,
              trigger: "blur"
            }],
            value:'',
          },
          {
            title: '邮箱地址',
            name: 'email',
            type: 'input',
            rules: [
              // {required: false, type:'email',trigger: "blur"},
              {validator: this.common.validate.email, required: true, trigger: "blur"}
            ],
            value:''
          },
        ],
        developerEditFormUrl:'/merchantApp/updateDeveloperInfo',
      }
    },
    components: {modalForm,list,confirm},
    computed: {
      tabIndex() {
        return this.$store.state.merchant.tabIndex;
      },
    },
    mounted () {

    },
    created(){
      // 获取应用详情
      this.getDetail()

    },
    methods: {
      sucessDone(){
        this.getDetail()
      },
      // // 获取应用来源
      // getMerchantSource(){
      //   this.$store.dispatch("getMerchantSource").then(res=>{
      //
      //   })
      // },
      // 获取应用详情
      getDetail(){
        let url = '/merchantApp/detail/'+this.$route.query.id
        this.apiGet(url).then(res=>{
          if(res.success){
            this.appDetail = res.data
            // 功能状态
            this.appDetail.functionStatusName = this.filter.turn("functionStatus",this.appDetail.functionStatus)
            // 应用状态
            this.appDetail.appStatusName = this.filter.turn("appStatus",this.appDetail.appStatus)
            this.appDetail.appScene = this.appDetail.appScene+""
            this.appDetail.appStatus = this.appDetail.appStatus+""
            // 设置选中项
            this.funSelected = []
            this.appDetail.merchantChannelList.forEach(ele=>{
              this.funSelected.push(ele.channelProductCode+"_"+ele.payProductCode)
            })
            // 商户来源转换
            this.$store.dispatch("getMerchantSource").then(res2=>{
              // 表格商户来源转换
              res2.forEach(ele=>{
                if(ele.value == this.appDetail.orderSource){
                  this.$set(this.appDetail,'orderSourceName',ele.label)
                }
              })
            })

            if(this.$store.state.merchant.tabIndex == 3){
              // 如果选项卡处于开发配置
              this.getDevelopConfig()
            }
          }else{
            this.$Message.warning(res.message)
          }
        })
      },
      // 打开编辑开发者信息弹框
      openDeveloperEdit(){
        this.developerEditformShow = true
        this.developerEditformItems.forEach(ele=>{
          if(typeof this.configInfo[ele.name] !='undefined'){
            ele.value = this.configInfo[ele.name]
          }
        })
      },
      // 密钥字符串使用******替换中间
      strFormat(str){
        let formatStr = ''
        let length = str.length
        if(length>20){
          formatStr = str.substr(0,10) + "******" + str.substr(length-10,10);
        }
        return formatStr
      },
      onCopy() {
        this.$Message.success("复制成功！");
      },
      onError() {
        this.$Message.error("复制失败！");
      },
      // 添加功能取消
      cancel(){
        this.addFunModal = false
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
      changeSelection (selection) {
        this.selection = selection
      },
      // 打开编辑弹框
      openApplyEdit(){
        this.applyEditformShow = true
        // 应用赋值
        this.applyEditformItems.forEach(ele=>{
          if(typeof this.appDetail[ele.name] != 'undefined'){
            ele.value = this.appDetail[ele.name]
          }
        })
      },
      //  tab切换
      tabClick(index){
        this.$store.state.merchant.tabIndex=index;
        if(index == 3){
          // 获取应用开发配置信息
          this.getDevelopConfig()

        }
        // this.tabIndex = index
      },
      getDevelopConfig(){
        let url = '/merchantApp/configDetail/'+this.appDetail.id
        this.apiGet(url).then(res=>{
          if(res.success){
            this.configInfo = res.data
            this.configInfo.mchPrivateKeyShort = this.strFormat(this.configInfo.mchPrivateKey)
            this.configInfo.publicKeyShort = this.strFormat(this.configInfo.publicKey)
          }else{
            this.$Message.warning(res.message)
          }
        })
      },
      //  打开添加功能弹框
      openFucAdd(){
        this.addFunModal = true
        this.chooseFunType(this.common.dic.funType[0])
        this.getChannel()
      },
      // 选择功能分类
      chooseFunType(item){
        this.funSearchParams.type = item.value
        this.funListData = []
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
      beforeSave(formItem){
        formItem.id = this.appDetail.id
        formItem.merchantNo = this.appDetail.merchantNo
        // formItem.appStatus = this.appDetail.appStatus
      },
      onSuccess(res){
        this.getDetail()
      },
      onSuccessDeveloper(res){
        this.getDevelopConfig()
      }
    }
  }
</script>
<style lang="scss">
  .apply-manage-box{
    .default-btn{
      margin-left: 16px;
      color: #2d8cf0;
    }
    .apply-manage-top{
      padding-bottom: 30px;
      .apply-icon{
        width: 55px;
        height: 55px;
        border-radius: 5px;
        vertical-align: middle;
      }
      .apply-info-box {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        .apply-info-top{
          font-size: 15px;
        }
        .apply-info-name{
          font-weight: bold;
          font-size: 16px;
        }
        .apply-info-payId-value{
          font-size: 15px;
        }
        .apply-info-payId{
          padding: 3px 5px;
          font-size: 12px;
          display: inline-block;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          color: #999;
        }
      }
    }
    .tab-box{
      border-bottom: 1px solid #ccc;
      padding-bottom: 13px;
      .tab-item{
        display: inline-block;
        margin-right: 20px;
        font-size: 14px;
        position: relative;
        .tab-item-tag{
          position: absolute;
          bottom:20px;
          right: 0;
          font-size: 12px;
          /*background-color: #cc7d0d;*/
          color: #fff;
          border-radius: 5px;
          padding: 5px 5px 7px;
          background: url("../../assets/images/tip.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .tab-item.active{
        .tab-item-name{
          font-weight: bold;
          color: #409EFF;
          padding-bottom: 15px;
          border-bottom: 2px solid #409EFF;
        }
      }
    }
    .apply-info-table{
      padding-bottom: 20px;
      width: 100%;
      td{
        height: 35px;
      }
      .apply-info-label{
        color: #999;
      }
    }
    .apply-section-title{
      font-weight: bold;
      font-size: 14px;
      padding: 10px 0;
    }
    .tab-content-box{
      padding: 20px 0;
    }
    .add-fun-btn-box{
      margin-bottom: 20px;
    }
    .dev-config-info-group{
      padding: 10px 0;
    }
    td.fun-name{
      .ivu-table-cell{
        overflow:visible;
        position: relative;
        .fun-name-tip{
          padding:2px 8px;
          text-align: center;
          color: #f00;
          border: 1px solid #f00;
          border-radius: 20px;
          margin-left: 3px;
          word-break: keep-all;
        }
        .fun-name-value{
          padding-left: 20px;
          display: block;
        }
      }
    }
  }

  .fun-type-btn-box{
    margin-bottom: 20px;
    .search-box{
      padding: 20px 0;
    }
  }
</style>

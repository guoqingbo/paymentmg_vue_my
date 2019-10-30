<template>
  <div>
    <div class="apply-manage-box">
      <!--头部信息-->
      <div class="apply-manage-top">
        <img class="apply-icon" :src='headerImg'>
        <div class="apply-info-box">
          <div class="apply-info-top">
            <span>胡杨林小鲸商城</span>
            <Button type="primary" size="small" @click="openApplyEdit">编辑</Button>
            <!--<span class="apply-edit-btn" @click="openApplyEdit">编辑</span>-->
          </div>
          <div class="apply-info-bottom">
            <span>PAYID</span>
            <span>120596655888</span>
          </div>
        </div>
      </div>
      <!--tab选项卡-->
      <div class="tab-box">
        <div class="tab-item" @click="tabClick(1)" :class="{active:tabIndex==1}">
          <span class="tab-item-name">应用概述</span>
        </div>
        <div class="tab-item" @click="tabClick(2)" :class="{active:tabIndex==2}">
          <span class="tab-item-tag">未配置</span>
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
                <span class="apply-info-value">胡杨小靓衫唱歌和那个</span>
              </td>
              <td>
                <span class="apply-info-label">应用来源：</span>
                <span class="apply-info-value">胡杨小靓衫唱歌和那个</span>
              </td>
              <td>
                <span class="apply-info-label">创建时间：</span>
                <span class="apply-info-value">胡杨小靓衫唱歌和那个</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="apply-info-label">所属商户：</span>
                <span class="apply-info-value">胡杨小靓衫唱歌和那个</span>
              </td>
              <td>
                <span class="apply-info-label">应用状态：</span>
                <span class="apply-info-value">已上线</span>
              </td>
              <td>
                <span class="apply-info-label">最近更新时间：</span>
                <span class="apply-info-value">胡杨小靓衫唱歌和那个</span>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <span class="apply-info-label">应用描述：</span>
                <span class="apply-info-value">胡杨小靓衫唱歌和那个</span>
              </td>
            </tr>
          </table>
          <div class="apply-fun-box">
            <div class="apply-section-title">应用功能：</div>
            <Table stripe
                   border
                   :columns="funColumns"
                   :data="funData"></Table>
          </div>
        </div>
        <!--功能管理-->
        <div class="fun-manage-box" v-if="tabIndex==2">
          <div class="add-fun-btn-box">
            <Button type="primary" @click="openFucAdd" icon="md-add">添加功能</Button>
            <span class="add-fun-tip">
            <Icon type="md-alert" size="16"/>
            请先通过“添加功能”添加所需的功能，再通过“配置”功能服务配置参数
          </span>
          </div>
          <Table stripe
                 border
                 :columns="addFunColumns"
                 :data="funData"></Table>
        </div>
        <!--开发配置-->
        <div class="dev-config-box" v-if="tabIndex==3">
          <div class="dev-config-info-top">
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">商户号（merchantNo）：</span>
              <span class="dev-config-info-value">45665363</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">支付标识（PayID）：</span>
              <span class="dev-config-info-value">45665363</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">商户/平台私钥（RSA私钥）：</span>
              <span class="dev-config-info-value">45665363</span>
              <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">支付中心公钥（RSA公钥）：</span>
              <span class="dev-config-info-value">45665363</span>
              <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">正式环境地址：</span>
              <span class="dev-config-info-value">45665363</span>
            </div>
          </div>
          <div class="apply-section-title">
            <span>开发作者信息</span>
            <Button type="primary" @click="openDeveloperEdit">编辑</Button>
          </div>
          <div class="developer-info-box">
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">开发管理员：</span>
              <span class="dev-config-info-value">45665363</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">手机号码：</span>
              <span class="dev-config-info-value">45665363</span>
            </div>
            <div class="dev-config-info-group">
              <span class="dev-config-info-label">邮箱地址：</span>
              <span class="dev-config-info-value">45665363</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--编辑应用-->
    <modalForm v-model="applyEditformShow"
               :formItems="applyEditformItems"
               @beforeSave='beforeSave'
               :url="applyEditFormUrl"
               title="编辑应用">
    </modalForm>
    <!--添加功能-->
    <Modal v-model="addFunModal"
           title="添加功能"
           @on-ok="ok"
           @on-cancel="cancel"
           width="750">
      <div class="fun-type-box">
        <div class="fun-type-btn-box">
          <Button v-for="(item,index) in funType"
                  :key="index"
                  style="margin-right: 20px"
                  :type="item.value==funTypeValue?'primary':'default'"
                  @click="chooseFunType(item)">{{item.label}}</Button>
          <div class="search-box">
            <Select v-model="searchParams.server" style="width:200px" placeholder="请选择服务商">
              <Option v-for="item in common.dic.splitType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary"
                    @click="query()">查询</Button>
          </div>
          <Table stripe
                 border
                 :columns="funListColumns"
                 @on-selection-change="changeSelection"
                 :data="funListData"></Table>
        </div>
      </div>
    </Modal>
    <!--编辑开发者信息-->
    <modalForm v-model="developerEditformShow"
               :formItems="developerEditformItems"
               :url="developerEditFormUrl"
               title="开发者信息">
    </modalForm>
  </div>
</template>
<script>
  import modalForm from '@/components/global/modalForm'
  import list from '@/components/global/list'
  export default {
    data () {
      return {
        headerImg:require("../../assets/images/touxiang.png"),
        applyEditformShow:false,
        applyEditformItems: [
          {
            title: '应用名称',
            name: 'merchantName',
            type: 'input',
            rules: [
              {required: true, message: '请输入应用名称', trigger: 'blur'},
              {max: 32, message: "应用名称不超过32字符", trigger: 'blur'}
            ],
            value: ""
          },
          {
            title: '应用图标',
            name: 'licenseUrl',
            type: 'uploadFile',
            tip: '请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于2M'
          },
          {
            title: '应用简介',
            name: 'privateKey',
            type: 'textarea',
            value: '',
            disabled: false,
          },
          {
            title: '适用场景',
            name: 'idType',
            type: 'select',
            data: this.common.dic.idType,
            rules: [
              {required: true,message: '请选择适用场景', trigger: 'change'}
            ],
            value: ''
          },
      ],
        applyEditFormUrl:'',
        funColumns:[
          {
            title: '功能名称',
            key: 'name'
          },
          {
            title: '功能服务商',
            key: 'name'
          },
          {
            title: '支付产品',
            key: 'name'
          },
          {
            title: '功能代码',
            key: 'name'
          },
          {
            title: '功能分类',
            key: 'name'
          },
          {
            title: '状态',
            key: 'name'
          },
          {
            title: '添加时间',
            key: 'name'
          }
        ],
        funData:[
          {
            name:'gggg'
          }
        ],
        tabIndex:1,
        addFunColumns:[
          {
            title: '功能名称',
            key: 'name'
          },
          {
            title: '功能服务商',
            key: 'name'
          },
          {
            title: '支付产品',
            key: 'name'
          },
          {
            title: '功能代码',
            key: 'name'
          },
          {
            title: '功能分类',
            key: 'name'
          },
          {
            title: '状态',
            key: 'name'
          },
          {
            title: '添加时间',
            key: 'name'
          },
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
                      path: "/merchant/applyManageDetail",
                      query: {id: params.row.id}
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
                      "/merchant/delete/" + params.row.id
                    );
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        addFunModal:false,
        funType:[
          {label:"支付",value:"1"},
          {label:"分账",value:"2"},
          {label:"保险",value:"3"},
          {label:"金融",value:"4"},
        ],
        funTypeValue:'1',
        funListColumns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '服务商',
            key: 'name'
          },
          {
            title: '支付产品',
            key: 'name'
          },
          {
            title: '功能名称',
            key: 'name'
          },
          {
            title: '功能分类',
            key: 'name'
          },
          {
            title: '功能代码',
            key: 'name'
          }
        ],
        funListData:[
          {
            name:'gggg'
          }
        ],
        selection:'',
        searchParams:{
          server:''
        },
        copyUrl:'',
        developerEditformShow:false,
        developerEditformItems: [
          {
            title: '开发管理员',
            name: 'merchantName',
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
            name: 'contactEmail',
            type: 'input',
            rules: [
              // {required: false, type:'email',trigger: "blur"},
              {validator: this.common.validate.email, required: true, trigger: "blur"}
            ]
          },
        ],
        developerEditFormUrl:'',
      }
    },
    mounted () {

    },
    created(){

    },
    components: {modalForm,list},
    methods: {
      // 打开编辑开发者信息弹框
      openDeveloperEdit(){
        this.developerEditformShow = true
      },
      onCopy() {
        this.$Message.success("复制成功！");
      },
      onError() {
        this.$Message.error("复制失败！");
      },
      // 添加功能取消
      cancel(){

      },
      // 添加功能确认
      ok(){
        console.log(this.selection)
      },
      changeSelection (selection) {
        this.selection = selection
      },
      // 打开编辑弹框
      openApplyEdit(){
        this.applyEditformShow = true
      },
      //  tab切换
      tabClick(index){
        this.tabIndex = index
      },
      //  打开添加功能弹框
      openFucAdd(){
        this.addFunModal = true
      },
      // 选择功能分类
      chooseFunType(item){
        this.funTypeValue = item.value
      },
      beforeSave(formItem){
        console.log(formItem)
      }
    }
  }
</script>
<style scoped lang="scss">
  .apply-manage-box{
    .apply-manage-top{
      padding-bottom: 30px;
      .apply-icon{
        width: 35px;
        height: 35px;
        border-radius: 5px;
        vertical-align: middle;
      }
      .apply-info-box {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        .apply-edit-btn{
          margin-left: 10px;
          color: #3720d4;
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
          background-color: #cc7d0d;
          color: #fff;
          border-radius: 5px;
          padding: 2px 5px;
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
  }
  .fun-type-btn-box{
    margin-bottom: 20px;
  }
  .search-box{
    padding: 20px 0;
  }
  .dev-config-info-group{
    padding: 10px 0;
  }
</style>

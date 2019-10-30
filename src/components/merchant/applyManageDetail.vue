<template>
  <div>
    <div class="apply-manage-box">
      <!--头部信息-->
      <div class="apply-manage-top">
        <img class="apply-icon" :src='headerImg'>
        <div class="apply-info-box">
          <div class="apply-info-top">
            <span>胡杨林小鲸商城</span>
            <span class="apply-edit-btn" @click="openApplyEdit">编辑</span>
          </div>
          <div class="apply-info-bottom">
            <span>PAYID</span>
            <span>120596655888</span>
          </div>
        </div>
      </div>
      <!--tab选项卡-->
      <div class="tab-box">

      </div>
      <!--应用概述-->
      <div class="apply-summary-box"></div>
      <!--功能管理-->
      <div class="fun-manage-box"></div>
      <!--开发配置-->
      <div class="dev-config-box"></div>
    </div>

    <!--编辑应用-->
    <modalForm v-model="applyEditformShow"
               :formItems="applyEditformItems"
               @beforeSave='beforeSave'
               :url="applyEditFormUrl"
               title="编辑应用">
    </modalForm>
  </div>
</template>
<script>
  import modalForm from '@/components/global/modalForm'
  export default {
    data () {
      return {
        headerImg:require("../../assets/images/touxiang.png"),
        applyEditformShow:false,
        applyEditformItems: [
        {
          title: '商户简称',
          name: 'merchantName',
          type: 'input',
          disabled: false,
          data: '',
          // rules: [{ required: true, message: '请选择商户来源', trigger: 'change' }]
        },
        {
          title: '私钥',
          name: 'privateKey',
          type: 'textarea',
          value: '',
          disabled: false,
          rules: [{ required: true, message: '请输入私钥', trigger: 'blur' },
          ]
        },
        {
          title: '上传营业执照',
          name: 'licenseUrl',
          type: 'uploadFile',
          tip: '建议上传小于2M的png、jpg、jpeg格式的图片',
          accept:'.jpg,.jpeg,.png',
          format:['jpg', 'jpeg', 'png'],
          rules: [{ required: true, message:'请上传上传营业执照', trigger: 'change'}],
          beforeUpload:(params)=>{}
        },
        {
          title: '所在地区',
          name: 'area',
          type: 'area',
          // addrCode: "",
          areaText:"",
          rules: [],
          value:''
        },
        {
          title: '默认推荐支付方式',
          name: 'priority',
          type: 'radio',
          value: 999,
          data:this.common.dic.priority,
          rules: [{ required: true, type:'number', message: '请选择默认推荐支付方式', trigger: 'change' }]
        },
        {
          title: '商户名称',
          name: 'merchantNo',
          value: '',
          type: 'autoComplete',
          data:[],
          search: (value)=>{
            let arrItem = this.common.getArrItem(this.formItems,'merchantNo')
            this.common.searchMerchantList(value,arrItem)
          }
        },
        {
          title: '商户类型',
          name: 'merchantType',
          type: 'select',
          data: this.common.dic.merchantType,
          onChange:this.merchantTypeChange,
          rules: [
            {required: true, type: 'number', message: '请选择商户类型', trigger: 'change'}
          ],
          value: 200,
        },
        {
          title: '开始日期',
          type: 'date',
          name: 'startDate',
          format:'yyyy-MM-dd 00:00:00',
          options:{},
          value: ''
        },
      ],
        applyEditFormUrl:'',
      }
    },
    mounted () {

    },
    created(){

    },
    components: {modalForm},
    methods: {
      openApplyEdit(){
        this.applyEditformShow = true
      }
    }
  }
</script>

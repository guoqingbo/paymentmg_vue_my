<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              @beforeSave="beforeSave">
    </formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";

  export default {
    components: {formList},
    data() {
      return {
        formListUrl: "/merchantApp/save",
        formList: [
          {
            title: '所属商户',
            name: 'merchantNo',
            data: [],
            type: 'autoComplete',
            value: '',
            disabled: false,
            search: (value) => {
              let arrItem = this.common.getArrItem(this.formList, 'merchantNo')
              this.common.searchMerchantList(value, arrItem)
            },
            rules: [{required: true, message: '请选择所属商户', trigger: 'blur'},
              // { max: 60, message: "商户号不超过60字符" }
            ]
          },
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
            tip: '请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于2M'
          },
          {
            title: '应用来源',
            name: 'orderSource',
            type: 'select',
            data: '',
            rules: [{ required: true, message: '请选择应用来源', trigger: 'change' }],
            onChange: this.orderSourceOnChange,
            value:'150'
          },
          // {
          //   title: '支付标识（PayID）',
          //   name: 'payId',
          //   type: 'input',
          //   rules: [
          //     {required: true, message: '请输入支付标识（PayID）', trigger: 'blur'},
          //   ],
          //   tip:'业务系统与支付中心约定的支付标识，如小鲸的m_ID、云票的务企业码等',
          //   value: ""
          // },
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
            value: 1
          }
        ],// 商户类型为个人时
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {},
    created() {
      // 获取商户来源
      this.getMerchantSource()
    },
    methods: {
      // 获取商户来源
      getMerchantSource(){
        this.$store.dispatch("getMerchantSource").then(res=>{
          this.common.setArrItem(this.formList,'orderSource',{data:res})
        })
      },
      // 确认保存之前
      beforeSave(formItem) {
        // 商户名，商户号拆分
        this.common.splitMerchant(formItem)
      },
      // 应用来源更改时
      orderSourceOnChange(e) {
        console.log(e)
        let payId =  {
            title: '支付标识（PayID）',
            name: 'payId',
            type: 'input',
            rules: [
              {required: true, message: '请输入支付标识（PayID）', trigger: 'blur'},
            ],
            tip:'平台与支付中心约定的平台的支付标识，小鲸商城的店铺ID、云pms的店铺编号等',
            value: ""
          }
        let payIdIndex=''
        // 查询payId的索引
        this.formList.forEach((ele,index)=>{
          if(ele.name == 'payId'){
            payIdIndex = index
          }
        })
        if (e==150) {
          // 当应用来源选择“普通应用”时，支付标识payId隐藏
          if(payIdIndex){
            this.formList.splice(payIdIndex,1)
          }
        } else {
          if(!payIdIndex){
            this.formList.splice(4, 0,payId)
          }
        }
      }
    }
  }
</script>

<style lang="scss">

</style>

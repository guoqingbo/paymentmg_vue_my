<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"></formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";
  export default {
    components: {formList},
    data () {
      return {
        formListUrl:"/merchant/merchant/save",
        formList: [
          {
            title: '商户类型',
            name: 'type',
            type: 'select',
            data:this.common.dic.merchantType,
            rules: [
              { required: true, message: '请选择商户类型', trigger: 'change' }
            ]
          },
          {
            title: '商户简称',
            name: 'name',
            type: 'input',
            rules: [
              { required: true, message: '请输入商户简称', trigger: 'blur' },
              { max: 50, message: "商户简称不超过50字符" ,trigger: 'blur'}
            ]
          },
          {
            title: '企业名称',
            name: 'corpName',
            type: 'input',
            rules: [{ required: true, message: '请输入企业名称', trigger: 'blur' },
              { max: 60, message: "企业名称不超过50字符",trigger: 'blur'  }]
          },
          {
            title: '上级商户号',
            name: 'parentMerchantId',
            type: 'input',
            rules: [{ required: true, message: '请输入上级商户号', trigger: 'blur' },
              { max: 60, message: "上级商户号不超过50字符",trigger: 'blur'  }]
          },
          {
            title: '法定代表人姓名',
            name: 'legalPersonName',
            type: 'input',
            rules: [{ max: 60, message: "法定代表人姓名不超过50字符",trigger: 'blur'  }]
          },
          {
            title: '身份证号码',
            name: 'legalPersonIdNo',
            type: 'input',
            rules: [{
              required: false, validator: this.common.validate.IdCodeValid, trigger: 'blur' }]
          },
          {
            title: '社会统一信用代码',
            name: 'unifiedSocialCreditCode',
            type: 'input',
            rules: [{ max: 60, message: "信用代码不超过50字符",trigger: 'blur'  }]
          },
          {
            title: '开户行名称',
            name: 'bankName',
            type: 'input',
            rules: [{ max: 60, message: "开户行名称不得超过50字符",trigger: 'blur'  }]
          },
          {
            title: '银行账号',
            name: 'bankAccount',
            type: 'input',
            rules: [{ max: 60, message: "银行账号不得超过50字符",trigger: 'blur'  }]
          },
          {
            title: '所在地区',
            name: 'areaCode',
            type: 'area',
          },
          {
            title: '详细地址',
            name: 'detailedAddress',
            type: 'input',
            rules: [{ max: 100, message: "详细地址不得超过100字符",trigger: 'blur'  }]
          },
          {
            title: '上传营业执照',
            name: 'businessLicensePic',
            type: 'uploadFile',
            tip:'建议上传小于10M的png、jpg、jpeg格式的图片'
          },
        ],
        routeType:"add",// 判断是新增，详情，编辑
      }
    },
    watch: {

    },
    created () {
      let routeType = this.$route.query.routeType
      console.log(routeType)
      if (routeType == 'detail' || routeType == 'edit') {
        this.routeType = routeType
        this.apiPost("/admin/webapi/guide/getById", {
          id: this.$route.query.id
        }).then(res => {
          if (res.status == 200) {

          }
        });
      } else {
        this.routeType = 'add'
      }
      console.log(this.routeType)
    },
    methods: {
    }
  }
</script>

<style lang="scss">

</style>

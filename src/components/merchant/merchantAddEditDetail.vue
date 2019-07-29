<template>
  <div>
    <formList :formItems="formList"
              :routeType="routeType"
              :url="formListUrl"
              @beforeSave="beforeSave"></formList>
  </div>
</template>

<script>
  import formList from "@/components/global/formList";

  export default {
    components: {formList},
    data() {
      return {
        formListUrl: "/merchant/save",
        formList:[],
        formList0: [
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
            title: '商户简称',
            name: 'merchantName',
            type: 'input',
            rules: [
              {required: true, message: '请输入商户简称', trigger: 'blur'},
              {max: 50, message: "商户简称不超过50字符", trigger: 'blur'}
            ]
          },
          {
            title: '企业名称',
            name: 'corpName',
            type: 'input',
            rules: [{required: true, message: '请输入企业名称', trigger: 'blur'},
              {max: 50, message: "企业名称不超过50字符", trigger: 'blur'}]
          },
          {
            title: '上级商户号',
            name: 'parentMerchantCode',
            type: 'input',
            rules: [{max: 50, message: "上级商户号不超过50字符", trigger: 'blur'}]
          },
          {
            title: '法定代表人姓名',
            name: 'legalPersonName',
            type: 'input',
            rules: [{max: 50, message: "法定代表人姓名不超过50字符", trigger: 'blur'}]
          },
          {
            title: '身份证号码',
            name: 'legalPersonIdNo',
            type: 'input',
            rules: [{
              required: false, validator: this.common.validate.IdCodeValid, trigger: 'blur'
            }]
          },
          {
            title: '社会统一信用代码',
            name: 'unifiedSocialCreditCode',
            type: 'input',
            rules: [{max: 50, message: "信用代码不超过50字符", trigger: 'blur'}]
          },
          {
            title: '开户行名称',
            name: 'bankName',
            type: 'input',
            rules: [{max: 50, message: "开户行名称不得超过50字符", trigger: 'blur'}]
          },
          {
            title: '银行账号',
            name: 'accountNo',
            type: 'input',
            rules: [{max: 50, message: "银行账号不得超过50字符", trigger: 'blur'}]
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
            title: '详细地址',
            name: 'detailedAddress',
            type: 'input',
            rules: [{max: 100, message: "详细地址不得超过100字符", trigger: 'blur'}]
          },
          {
            title: '上传营业执照',
            name: 'licenseUrl',
            type: 'uploadFile',
            tip: '建议上传小于2M的png、jpg、jpeg格式的图片'
          },
        ],// 商户类型为企业时
        formList1: [
          {
            title: '商户类型',
            name: 'merchantType',
            type: 'select',
            data: this.common.dic.merchantType,
            onChange:this.merchantTypeChange,
            rules: [
              {required: true, type: 'number', message: '请选择商户类型', trigger: 'change'}
            ],
            value: 100
          },
          {
            title: '姓名',
            name: 'merchantName',
            type: 'input',
            rules: [
              {required: true, message: '请输入姓名', trigger: 'blur'},
              {max: 50, message: "姓名不超过50字符", trigger: 'blur'}
            ],
            value: ""
          },
          {
            title: '证件类型',
            name: 'idType',
            type: 'select',
            data: this.common.dic.idType,
            rules: [
              {required: false, type:'number',message: '请选择证件类型', trigger: 'change'}
            ],
            onChange:this.idTypeChange,
            value: 1
          },
          {
            title: '证件号码',
            name: 'idCard',
            type: 'input',
            rules: [{ required: false,validator:this.common.validate.IdCodeValid,trigger: 'blur'}],
            value: ""
          },
          {
            title: '上级商户号',
            name: 'parentMerchantCode',
            type: 'input',
            rules: [{max: 50, message: "上级商户号不超过50字符", trigger: 'blur'}],
            value: ""
          },
          {
            title: '手机号码',
            name: 'phone',
            type: 'input',
            rules: [{
              validator: this.common.validate.phone,
              required: false,
              trigger: "blur"
            }],
            value:'',
          },
          {
            title: '开户行名称',
            name: 'bankName',
            type: 'input',
            rules: [{max: 50, message: "开户行名称不得超过50字符", trigger: 'blur'}],
            value: ""
          },
          {
            title: '银行户名',
            name: 'accountName',
            type: 'input',
            rules: [{max: 50, message: "银行户名不得超过50字符", trigger: 'blur'}],
            value: ""
          },
          {
            title: '银行账号',
            name: 'accountNo',
            type: 'input',
            rules: [{max: 50, message: "银行账号不得超过50字符", trigger: 'blur'}],
            value: ""
          },
          {
            title: '所在地区',
            name: 'area',
            type: 'area',
            // addrCode: "",
            areaText:"",
            rules: [],
            value: "",
          },
          {
            title: '详细地址',
            name: 'detailedAddress',
            type: 'input',
            rules: [{max: 100, message: "详细地址不得超过100字符", trigger: 'blur'}],
            value: ""
          },
        ],// 商户类型为个人时
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {},
    created() {
      // 更改商户类型
      this.merchantTypeChange(200)
      // 如果是编辑，详情
      this.getDetail()
    },
    methods: {
      // 证件类型改变时
      idTypeChange(e){
        // 1身份证 2护照 3港澳通行证
        if(e==1){
          this.formList1[3].rules[0].validator = this.common.validate.IdCodeValid
        }else if(e==2){
          this.formList1[3].rules[0].validator = this.common.validate.passport
        }else if(e==3){
          this.formList1[3].rules[0].validator = this.common.validate.passportHM
        }
      },
      // 确认保存之前
      beforeSave(formItem) {
        if (formItem.areaObj) {
          // 转换省市区
          let area = formItem.areaObj
          formItem.provinceCode = area[0].value;
          formItem.province = area[0].label;
          formItem.cityCode = area[1].value;
          formItem.city = area[1].label;
          formItem.districtCode = area[2].value;
          formItem.district = area[2].label;
          delete formItem.areaObj
          delete formItem.area
        }
        if (this.$route.query.id) {
          formItem.id = this.$route.query.id
        }
      },
      getDetail() {
        if (this.$route.query.id) {
          let id = this.$route.query.id
          this.routeType = this.$route.query.routeType
          if (this.routeType == 'detail') {
            // 如果是详情页

            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '商户详情'])
          } else {
            // 如果是编辑
            this.formListUrl = '/merchant/update'
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '编辑商户'])
          }
          this.apiGet("/merchant/" + id).then(res => {
            if (res.status == 200 && res.data) {
              // 更改账户类型
              this.merchantTypeChange(res.data.merchantType)
              if (this.routeType == 'detail') {
                // 如果是详情页
              } else {
                // 如果是编辑
                // 更改证件类型验证
                this.idTypeChange(res.data.idType)
              }
              this.formList[0].disabled = true
              this.formList.forEach((ele) => {
                ele.value = res.data[ele.name]
                if (this.routeType == 'detail' && ele.type != 'text') {
                  // 如果是详情页
                  ele.type += "Text"
                  if (ele.name == 'area') {
                    // 初始化区域
                    let addrCodeName = [res.data.province, res.data.city, res.data.district].filter(ele=>{
                      if(ele){
                        return true
                      }
                    })
                    ele.areaText = addrCodeName.join("-")
                  }
                }
                if (this.routeType !== 'detail' && ele.name == 'area') {
                  // 如果是编辑页
                  if (ele.name == 'area') {
                    let addrCode = [res.data.provinceCode, res.data.cityCode, res.data.districtCode]
                    // ele.addrCode = addrCode.join("-")
                    ele.value = addrCode.join("-")
                    // if (addrCode[0] && addrCode[1] && addrCode[2]) {
                    //   ele.addrCode = addrCode.join("-")
                    // }
                  }
                }
              })
            }
          });
        }
      },
      // 更改商户类型
      merchantTypeChange(type){
        // 100 个人商户 200企业商户
        if(type == 100){
          this.formList1[0].value = 100
          this.formList = this.formList1
        }else{
          this.formList0[0].value = 200
          this.formList = this.formList0
        }
      }
    }
  }
</script>

<style lang="scss">

</style>

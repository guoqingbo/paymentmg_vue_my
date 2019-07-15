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
        formList: [
          {
            title: '商户类型',
            name: 'merchantType',
            type: 'select',
            data: this.common.dic.merchantType,
            rules: [
              {required: true, type: 'number', message: '请选择商户类型', trigger: 'change'}
            ],
            value: ""
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
            addrCode: "",
            areaText:"",
            rules: []
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
            tip: '建议上传小于10M的png、jpg、jpeg格式的图片'
          },
        ],
        routeType: "",// 判断是新增，详情，编辑
      }
    },
    watch: {},
    created() {
      // 如果是编辑，详情
      this.getDetail()
    },
    methods: {
      beforeSave(formItem) {
        // 确认保存之前
        if (formItem.area) {
          // 转换省市区
          let area = formItem.area
          formItem.provinceCode = area[0].value;
          formItem.province = area[0].label;
          formItem.cityCode = area[1].value;
          formItem.city = area[1].label;
          formItem.districtCode = area[2].value;
          formItem.district = area[2].label;
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
            this.formList[0].disabled = true
            // 更新位置占位符
            this.$store.dispatch('setBreadcrumbListAction', ['商户管理', '编辑商户'])
          }
          this.apiGet("/merchant/" + id).then(res => {
            if (res.status == 200 && res.data) {
              this.formList.forEach((ele) => {
                ele.value = res.data[ele.name]
                if (this.routeType == 'detail' && ele.type != 'text') {
                  // 如果是详情页
                  ele.type += "Text"
                  if (ele.name == 'area') {
                    // 初始化区域
                    let addrCodeName = [res.data.province, res.data.city, res.data.district]
                    ele.areaText = addrCodeName.join("-")
                  }
                }
                if (this.routeType !== 'detail' && ele.name == 'area') {
                  // 如果是编辑页
                  if (ele.name == 'area') {
                    let addrCode = [res.data.provinceCode, res.data.cityCode, res.data.districtCode]
                    if (addrCode[0] && addrCode[1] && addrCode[2]) {
                      ele.addrCode = addrCode.join("-")
                    }
                  }
                }
              })
            }
          });
        }
      },
    }
  }
</script>

<style lang="scss">

</style>
